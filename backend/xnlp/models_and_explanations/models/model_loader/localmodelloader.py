from os import path

from transformers import AutoModelForSequenceClassification, AutoTokenizer

from .modelloader import ModelLoaderStrategy
from xnlp import settings

class LocalModelLoaderStrategy(ModelLoaderStrategy):
    def __init__(self):
        self.models = {}
        self.tokenizers = {}

    def importModel(self, modelName):
        dirname = path.dirname(__file__)
        modelNameNoHyphen = modelName.replace("-", "")
        modelPath = path.join(dirname, settings.NLP_MODEL_DIRECTORY, modelNameNoHyphen)
        tokenizerPath = path.join(dirname, settings.NLP_TOKENIZER_DIRECTORY, modelNameNoHyphen)

        if self.models.get(modelPath) is not None and self.tokenizers.get(modelPath) is not None:
            return self.models.get(modelPath), self.tokenizers.get(modelPath)

        if path.exists(modelPath):
            # Create a instance of model
            self.models[modelPath] = AutoModelForSequenceClassification.from_pretrained(modelPath)
            self.tokenizers[modelPath] = AutoTokenizer.from_pretrained(tokenizerPath)
            print("model exists")
        else:
            # download model
            print("model loading")
            self.models[modelPath] = AutoModelForSequenceClassification.from_pretrained(modelName)
            self.models[modelPath].save_pretrained(modelPath)
            self.tokenizers[modelPath] = AutoTokenizer.from_pretrained(modelName)
            self.tokenizers[modelPath].save_pretrained(tokenizerPath)

        return self.models[modelPath], self.tokenizers[modelPath]
