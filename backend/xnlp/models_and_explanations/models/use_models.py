from transformers import pipeline
import torch
from .model_loader.modelloader import ModelLoaderStrategy

class RequestHandler():
    def __init__(self, strategy: ModelLoaderStrategy) -> None:
        self._strategy = strategy
        # Check if GPU is available
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print('Using device:', self.device)

    # Update the model loader strategy
    def strategy(self, strategy: ModelLoaderStrategy) -> None:
        self._strategy = strategy

    def importModel(self, modelName):
        model, tokenizer = self._strategy.importModel(modelName)
        sentiment_analysis = pipeline("sentiment-analysis", model, tokenizer=tokenizer, device=self.device)
        return sentiment_analysis 

    def importModelTopKClasses(self, modelName, k=None):
        model, tokenizer = self._strategy.importModel(modelName)
        sentiment_analysis = pipeline("sentiment-analysis", model, tokenizer=tokenizer, top_k=k, device=self.device)
        return sentiment_analysis
    
    def importModelAndPredict(self, modelName, input):
        model, tokenizer = self._strategy.importModel(modelName)
        sentiment_analysis = pipeline("sentiment-analysis", model, tokenizer=tokenizer, device=self.device)
        output = sentiment_analysis(input)
        return output
