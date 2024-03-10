import time
from typing import List, Tuple

from .polyjuice import Polyjuice
from ..models.use_models import RequestHandler
from ..models.model_loader.localmodelloader import LocalModelLoaderStrategy

model_handler = RequestHandler(LocalModelLoaderStrategy())
pj = Polyjuice()


def generate_perturbations(orig_sent,
                           blanked_sent: Tuple[str, List[str]] = None,
                           ctrl_code: Tuple[str, List[str]] = None,
                           perplex_thred=10,
                           num_perturbations=50):
    start_time = time.time()
    unique_perturbations = set()
    while len(unique_perturbations) < 5:
        generated = pj.perturb(
            orig_sent=orig_sent,
            blanked_sent=blanked_sent,
            ctrl_code=ctrl_code,
            perplex_thred=perplex_thred,
            num_perturbations=num_perturbations,
            num_beams=3
        )
        unique_perturbations.update(generated)
        if len(unique_perturbations) >= 3 and time.time() - start_time > 60:
            break
        if len(unique_perturbations) >= 2 and time.time() - start_time > 120:
            break
    return list(unique_perturbations)


def detect_ctrl_code(reference_sent, target_sentences):
    ctrl_codes = []
    for target in target_sentences:
        ctrl_code = pj.detect_ctrl_code(reference_sent, target)
        if ctrl_code is None:
            ctrl_code = 'none'
        ctrl_codes.append(ctrl_code)
    return ctrl_codes


def get_predictions(perturbations, model):
    predictions = []
    for perturbation in perturbations:
        prediction = model_handler.importModelAndPredict(model, perturbation)
        label = prediction[0].get('label')
        predictions.append(label)
    return predictions
