"""
URL configuration for xnlp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from ..models_and_explanations import model_and_explanation_views
from ..models_and_explanations.counterfactual_explanation.views import CounterfactualExplanationView
from ..models_and_explanations.misclassified_examples.views import MisclassifiedExampleView
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('counterfactual-explanation/generate-perturbations/', CounterfactualExplanationView.as_view()),
    path('explanation/shap-values', model_and_explanation_views.shap_values),
    path('explanation/lime', model_and_explanation_views.lime),
    path('randomTextFromDataset/', model_and_explanation_views.randomTextFromDataset),
    path('misclassified/get-examples/', MisclassifiedExampleView.as_view()),
    path('hello/', views.say_hello),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path('logout/', views.logout),
    path('update-role/', views.update_role),
    path('postExpectations/', views.post_expectations),
    path('explorations/', views.explorations_search),
    path('postFeedback/', views.postFeedback),
    path('generateOutput/', views.generateOutput),
    path('getMockExamples/', views.getMockResults),
    path('getPersonalData/', views.getPersonalData),
    path('updateUsername/', views.update_username),
    path('updatePassword/', views.update_password),
    path('updateEmail/', views.update_email),
    path('getStatistics/', views.getStatistics),
    path('getStatisticsForGoal/', views.getStatisticsForGoal),
]
