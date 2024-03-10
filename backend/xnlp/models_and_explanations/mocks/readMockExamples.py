import json
from os import path

def readFromJson():
    dirname = (path.dirname(__file__))
    mockFile = path.join(dirname, 'demodata.json')
    with open(mockFile) as file:
        return json.load(file)