from .modelloader import ModelLoaderStrategy

class CloudModelLoaderStrategy(ModelLoaderStrategy):
    def importModel(self, modelName):
        return "cloud import"