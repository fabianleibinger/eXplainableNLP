from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from collections import Counter
import shap
import numpy as np

from lime.lime_text import LimeTextExplainer
from .models.use_models import RequestHandler
from .models.model_loader.localmodelloader import LocalModelLoaderStrategy
from datasets import load_dataset
import random
import json

modelHandler = RequestHandler(LocalModelLoaderStrategy())

@csrf_exempt
@require_POST
def shap_values(request):
    request_data = json.loads(request.body)
    model_name = request_data['model_name']
    input_text = request_data['input_text']

    # Model prediction and shap explanation.
    model = modelHandler.importModel(model_name)
    output = model(input_text)
    explainer = shap.Explainer(model)
    shap_values = explainer(input_text)
    
    # Return the shap values for the most common label.
    if len(input_text) > 1:
        labels = [entry["label"] for entry in output]
        most_common_label = Counter(labels).most_common(1)[0][0]
        shap_values = [shap_values[input, :, most_common_label] for input in range(len(input_text))]
    else:
        shap_values = shap_values[0, :, output[0]["label"]]

    plot = shap.plots.text(shap_values, display=False)

    response_data = {
        "shap_values": shap_values.values.tolist(), 
        "base_values": shap_values.base_values.tolist(), 
        "feature_names": shap_values.feature_names,
        "plot_html": plot
    }

    return JsonResponse(response_data)

@csrf_exempt
@require_POST
def lime(request):
    request_data = json.loads(request.body)
    model_name = request_data['model_name']
    input_text = request_data['input_text']
    num_features = request_data['num_features']
    num_samples = request_data['num_samples']

    # Model has to output scores for each class.
    model = modelHandler.importModelTopKClasses(model_name)

    # Create a test output to get the class names.
    output = model(input_text)
    class_names = [output[0][j]['label'] for j in range(len(output[0]))]

    def predictor(texts):
        outputs = model(texts)
        return np.asarray([[outputs[i][j]['score'] for j in range(len(outputs[i]))] for i, _ in enumerate(texts)])


    explainer = LimeTextExplainer(class_names=class_names)

    # Create explanation for each input.
    explanations = []
    for i, pair in enumerate(zip(input_text)):
        input = pair[0]
        explanation = explainer.explain_instance(input, predictor, num_features=num_features, num_samples=num_samples)
        exp_response = {
            "features_values": explanation.as_list(),
            "plot_html": explanation.as_html()
        }
        explanations.append(exp_response)

    response_data = {
        "explanations": explanations
    }

    return JsonResponse(response_data)

@csrf_exempt
@require_POST
def randomTextFromDataset(request):
    try :
        request_data = json.loads(request.body)
        datasetName = request_data['dataset']
        dataset = load_dataset(datasetName)
        if 'test' in dataset:
            random_index = random.randint(0, len(dataset['test']) - 1)
            random_text = dataset['test'][random_index]
        elif 'train' in dataset:
            random_index = random.randint(0, len(dataset['train']) - 1)
            random_text = dataset['train'][random_index]
        else:
            raise ValueError("No data in the dataset")      
        print(random_text)
        text = ""
        if datasetName=="imdb" or datasetName=="argilla/tripadvisor-hotel-reviews" or datasetName=="argilla/uber-reviews" :
            text = random_text['text']
        elif (datasetName=="A-Roucher/amazon_product_reviews_datafiniti"):
            text = random_text['reviews.text']
        elif(datasetName=="app_reviews" or datasetName=="deelow/restaurant-reviews"):
            text = random_text['review']
        response_data = {
                "text": text,
                "message": "You successfully got a random text from the dataset"
            }
        return JsonResponse(response_data, status=200)

    except ValueError as error:
            return JsonResponse({'error': str(error)}, status=400)
