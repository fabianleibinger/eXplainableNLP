# XNLP - Explainable Natural Language Processing Application

## Description

This web application integrates state-of-the-art NLP explanation methods like [SHAP](https://shap.readthedocs.io/en/latest/), [LIME](https://lime-ml.readthedocs.io/en/latest/lime.html) and [Counterfactual Explanations](https://arxiv.org/abs/2101.00288) with [huggingface](https://huggingface.co/) text classification models and datasets.\
The app works with different visualization techniques for NLP newcomers (so-called "Explorers") and experts in the field (so-called "Analysts"). The latter are provided with additional functionality like explanation history ("Explorations"), supporting tasks like model debugging.

The backend consists of two main components, that are easily separable. 'models_and_explanations' handles model predictions, explanation methods (i.e. all computationally intensive tasks) and datasets.\
'xnlp' serves as an API Gateway, handles User and Data Management. It is connected to a MongoDB database. Additionally 'xnlp' collects usage data on the performance of NLP explanation methods for research purposes.

We refer to the `project_documentation.pdf` for more information.

## Local Installation

#### Prerequisites

Make sure to replace the MongoDB database configuration in `settings.py` with your own database.

### Backend

Check which version of the Python you have

```bash
python --version
```

Install version [Python 3.11](https://www.python.org/downloads/)

Setup a virtual environment

```bash
cd backend
pipenv --python 3.11
```

While inside the project folder, we need to activate the environment

```bash
pipenv shell
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend server

```bash
python manage.py runserver
```

That's all we need for the backend!

### Frontend

```bash
cd frontend
```

First install node v16 : https://nodejs.org/en/download

Install all packages needed from package.json

```bash
npm install
```

```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

## Deployment on Azure Cloud

#### Prerequisites

Make sure to replace the MongoDB database configuration in `settings.py` with your own database.

### Backend

Create a Web App called `xnlp-server`. You need at least a B3 App Service Plan for the server to run.

Configuration:

- PORT 8000
- SCM_DO_BUILD_DURING_DEPLOYMENT 1
- WEBSITE_HTTPLOGGING_RETENTION_DAYS 5
- WEBSITE_HEALTHCHECK_MAXPINGFAILURES 10
- WEBSITES_CONTAINER_START_TIME_LIMIT 800
- WEBSITES_PORT 8000

CORS configurations: \
Enable Access-Control-Allow-Credentials and add the url of your deployed frontend application as allowed origin.

Cookie settings:
For using the Cloud deployment we net set the cookie the following:
def set_token_cookie(response, token):
response.set_cookie("jwt", token, httponly=True, samesite="None", max_age=86400, secure=True)
If you are testing it localy some browsers may need instead:  
def set_token_cookie(response, token):
response.set_cookie("jwt", token, httponly=True, samesite="Strict", max_age=86400)

Deployment Center: \
Connect to your GitHub account after you've forked this repository to your GitHub account. The workflow files in the repository will handle the rest of the deployment.
A single deployment can take up to 1h.

Make sure to adjust `.yml` file for your backend as defined in the project files.

The web app will be deployed on a standard container. If you need GPU computing, make sure to create a container app on Azure, and select it for deployment.

### Frontend

Deployment Center: \
Create Static Web App in Azure. While creating under `Build Details` set `Build Presets` to `React`. \
Connect to your GitHub account after you've forked this repository to your GitHub account. The workflow files in the repository will handle the rest of the deployment. \

Make sure to adjust `.yml` file for your static web app as defined in the project files.

Replace API_URL in `App.js` with [https://xnlp-server.azurewebsites.net](https://xnlp-server.azurewebsites.net). 

The URL of your frontend Web App serves as the entry point to XNLP.

Make sure to enable third-party-cookies in your browser to access the app. For Safari also allow cross-side tracking.

Note: Running this frontend project on cloud is `Free` on Azure

## Usage

### Test user

username: `test` \
password: `test`

### Admin user

To create new admin account

```bash
python manage.py createsuperuser
```

## Authors and acknowledgment

Mürüvet Doganay, Didem Yaniktepe, Julian Heiß, Fabian Leibinger

## License
