from abc import ABC, abstractmethod

class ModelLoaderStrategy(ABC):
    """
    The Strategy interface declares operations common to all supported versions
    of some algorithm.

    The Context uses this interface to call the algorithm defined by Concrete
    Strategies.
    """

    @abstractmethod
    def importModel(self, modelName):
        pass