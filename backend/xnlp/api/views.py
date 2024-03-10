from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate as django_authenticate
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from ..models import User, Expectations, Feedback
import json
import jwt
from django.conf import settings
from ..middleware import JWTAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.db.models import Avg, Count

from ..models_and_explanations.models.use_models import RequestHandler
from ..models_and_explanations.models.model_loader.localmodelloader import LocalModelLoaderStrategy
from ..models_and_explanations.serializers.modelOutputSerializer import ModelOutputSerializer
from ..serializers.feedbackSerializer import FeedbackSerializer
from ..models_and_explanations.mocks import readMockExamples

requestHandler = RequestHandler(LocalModelLoaderStrategy())


# Create your views here. A view function takes a request and returns a response. It works as a request handler. Can be called in different languages as 'action'.
def say_hello(request):
    return HttpResponse("Hello World!")


@api_view(["POST"])
def generateOutput(request):
    data = json.loads(request.body)
    inputText = data.get("input_text")
    modelName = data.get("model_name")
    result = requestHandler.importModelAndPredict(modelName=modelName, input=inputText)
    # Use this when you want to run with Cloud Provider
    # requestHandler.strategy(CloudModelLoaderStrategy())
    serializer = ModelOutputSerializer(result[0])
    jsonResult = JSONRenderer().render(serializer.data)
    return HttpResponse(jsonResult)


@api_view(["POST"])
def register_user(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            firstname = data.get("firstname")
            lastname = data.get("lastname")
            password = data.get("password")
            username = data.get("username")
            email = data.get("email")
            role = data.get("role")

            if not all([email, username, firstname, lastname, password]):
                raise ValueError("Please add all fields")
            if "@" not in email:
                raise ValueError("Please add a valid email")

            if User.objects.filter(username=username).count() >= 1:
                raise ValueError("username is already taken")
            new_user = User.objects.create_user(
                username=username,
                password=password,
                first_name=firstname,
                last_name=lastname,
                email=email,
            )
            token = gen_token(new_user._id)
            response = Response(
                {
                    "username": new_user.username,
                    "email": new_user.email,
                    "firstname": new_user.first_name,
                    "lastname": new_user.last_name,
                    "role": new_user.role,
                },
                status=201,
            )
            set_token_cookie(response, token)
            return response
        else:
            return JsonResponse({"error": str(error)}, status=400)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)


@api_view(["POST"])
def login_user(request):
    print("hello")
    try:
        if request.method == "POST":
            data = request.data
            username = data.get("username")
            password = data.get("password")
            if username is None or password is None or username == "" or password == "":
                raise ValueError("Missing Username or Password")

            user = django_authenticate(request, username=username, password=password)
            print(user)
            if user is not None:
                token = gen_token(user._id)
                response = Response({
                    'username': user.username,
                    'staff': user.is_staff,
                    'email': user.email,
                    'firstname': user.first_name,
                    'lastname': user.last_name,
                    'role': user.role,
                }, status=200)
                set_token_cookie(response, token)
                return response

            else:
                raise ValueError("Invalid email or password")
        else:
            raise ValueError("No Post request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=401)


def gen_token(id):
    abc = str(id)
    token = jwt.encode({"id": abc}, settings.JWT_SECRET_KEY, algorithm="HS256")
    return token


def set_token_cookie(response, token):
    response.set_cookie("jwt", token, httponly=True, samesite="None", max_age=86400, secure=True)


@api_view(["POST"])
def logout(request):
    response = JsonResponse({"message": "User logged out successfully"})
    response.delete_cookie("jwt")
    return response


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getPersonalData(request):
    try:
        if request.method == "GET":
            user = get_object_or_404(User, username=request.user.username)
            return Response(
                {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
                status=200,
            )
        else:
            raise ValueError("No GET request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_role(request):
    try:
        if request.method == "PUT":
            data = request.data
            role = data.get("role")
            user_tochange = get_object_or_404(User, username=request.user.username)

            User.objects.filter(username=request.user.username).update(role=role)

            return Response(
                {
                    "username": user_tochange.username,
                    "role": role,
                    "message": "Profilinformation were updated",
                },
                status=200,
            )
        else:
            raise ValueError("No Post request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_username(request):
    try:
        if request.method == "PUT":
            data = request.data
            newUsername = data.get("newUsername")
            if not newUsername:
                raise ValueError("Please add a new Username")

            if User.objects.filter(username=newUsername).count() > 0:
                raise ValueError("Username already taken")

            if len(newUsername) < 5:
                raise ValueError("Username to short")

            user_tochange = get_object_or_404(User, username=request.user.username)

            User.objects.filter(username=request.user.username).update(
                username=newUsername
            )

            return Response(
                {"username": user_tochange.username, "message": "Username was updated"},
                status=200,
            )
        else:
            raise ValueError("No Post request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_password(request):
    try:
        if request.method == "PUT":
            data = request.data
            newPassword = data.get("newPassword")
            if not newPassword:
                raise ValueError("Please add a new Password")

            if len(newPassword) < 5:
                raise ValueError("Password to short")

            user_tochange = get_object_or_404(User, username=request.user.username)

            user_tochange.set_password(newPassword)
            user_tochange.save()

            return Response(
                {"username": user_tochange.username, "message": "Password was updated"},
                status=200,
            )
        else:
            raise ValueError("No Post request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_email(request):
    try:
        if request.method == "PUT":
            data = request.data
            newEmail = data.get("newEmail")
            if not newEmail:
                raise ValueError("Please add a new Email address")

            user_tochange = get_object_or_404(User, username=request.user.username)

            User.objects.filter(username=request.user.username).update(email=newEmail)

            return Response(
                {
                    "username": user_tochange.username,
                    "email": newEmail,
                    "message": "Email was updated",
                },
                status=200,
            )
        else:
            raise ValueError("No Post request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def post_expectations(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            goal_Expect = data.get("goalExpect")
            method_Expect = data.get("methodExpect")
            other_Expect = data.get("otherExpect")
            task_Expect = data.get("taskExpect")
            username = request.user.username
            user = get_object_or_404(User, username=username)

            if not goal_Expect:
                raise ValueError("Please add your goals")

            if User.objects.filter(username=username).count() != 1:
                raise ValueError("no user with this username")

            if Expectations.objects.filter(user=user._id).count() >= 1:
                raise ValueError("Expectations already set for this user")

            new_expectation = Expectations.objects.create(
                user=user._id,
                role=user.role,
                goal_Expect=goal_Expect,
                method_Expect=method_Expect,
                other_Expect=other_Expect,
                task_Expect=task_Expect,
            )

            return Response(
                {
                    "username": username,
                    "message": "expectations were added",
                },
                status=201,
            )

        else:
            return JsonResponse({"error": str(error)}, status=400)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def postFeedback(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            inputString = data.get("inputString")
            model = data.get("model")
            method = data.get("method")
            prediction = data.get("prediction")
            shapValues = data.get("shapValues")
            shapFeatures = data.get("shapFeatures")
            shapHTMLPlot = data.get("shapHTMLPlot")
            perturbations = data.get("perturbations")
            perturbationsPrediction = data.get("perturbationsPrediction")
            perturbationsCtrlCodes = data.get("perturbationsCtrlCodes")
            limeExplanation = data.get("limeExplanation")
            rating = data.get("rating")
            comment = data.get("comment")
            classifiedCorrectly = data.get("classifiedCorrectly")
            username = request.user.username
            user = get_object_or_404(User, username=username)

            if not all([method, model, rating]):
                raise ValueError("Please add all fields")

            if not method == "General Feedback" and (not inputString or not prediction):
                raise ValueError("You can only rate this for a given input and output")

            if User.objects.filter(username=username).count() != 1:
                raise ValueError("no user with this username")

            if (
                method != "General Feedback"
                and Feedback.objects.filter(user=user._id, inputString=inputString, method=method, model=model).count() >= 1

            ):
                raise ValueError(
                    "You already reviewed this input for the selected method and model"
                )

            new_expectation = Feedback(
                user=user._id,
                role=user.role,
                inputString=inputString,
                model=model,
                method=method,
                prediction=prediction,
                shapValues=shapValues,
                shapFeatures=shapFeatures,
                shapHTMLPlot=shapHTMLPlot,
                perturbations=perturbations,
                perturbationsPrediction=perturbationsPrediction,
                perturbationsCtrlCodes=perturbationsCtrlCodes,
                limeExplanation=limeExplanation,
                classifiedCorrectly=classifiedCorrectly,
                rating=rating,
                comment=comment,
            ).save()

            return Response(
                {
                    "username": username,
                    "message": "Feedback was added",
                },
                status=201,
            )

        else:
            return JsonResponse({"error": str(error)}, status=400)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def explorations_search(request):
    try:
        if request.method == "GET":
            # Unpack query parameters
            query_params = request.query_params
            print("Query parameters:", query_params)
            input_text = query_params.get("inputText")
            model = query_params.get("model")
            role = query_params.get("role")
            method = query_params.get("method")
            classified = query_params.get("classified").split(",")
            rating = int(query_params.get("rating"))
            statistics = query_params.get("statistics") == "true"
            goal_Expect = query_params.get("goal_Expect")

            # Get all explorations of the user
            user = get_object_or_404(User, username=request.user.username)
            if statistics == True:
                explorations = Feedback.objects.all()
            else :    
                explorations = Feedback.objects.filter(user=user._id)
            
            expectations = Expectations.objects.all()

            # Filter queryset based on query parameters
            if input_text:
                explorations = explorations.filter(inputString__icontains=input_text)

            if model:
                explorations = explorations.filter(model=model)

            if statistics  and role:
                explorations = explorations.filter(role=role)    

            if method:
                explorations = explorations.filter(method=method)

            if rating != 0:
                explorations = explorations.filter(rating=rating)

            print(goal_Expect)
            if goal_Expect:
                expectIds = list(expectations.filter(goal_Expect=goal_Expect).values_list('user', flat=True))
                explorations = explorations.filter(user__in=expectIds)
            tags = []
            if "correct" in classified:
                tags.append(True)
            if "incorrect" in classified:
                tags.append(False)
            explorations = explorations.filter(classifiedCorrectly__in=tags)

            # Order by 'created_at' in descending order (latest first)
            explorations = explorations.order_by('-created_at')

            serializer = FeedbackSerializer(
                explorations, many=True
            )  # Serialize the queryset
            return Response(
                {
                    "explorations": serializer.data,
                },
                status=200,
            )
        else:
            raise ValueError("No GET request was sent")
    except ValueError as error:
        return Response({"error": str(error)}, status=400)


@api_view(["GET"])
def getMockResults(request):
    return JsonResponse(readMockExamples.readFromJson(), safe=False)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getStatistics(request):
    try:
        if request.method == 'GET':
            user = get_object_or_404(User, username=request.user.username)
            if user.is_staff != True:
                raise ValueError('You are not authorized for this request.')
            allFeedback = Feedback.objects.all()
            allFeedbackExplorer = Feedback.objects.filter(role = "explorer")
            allFeedbackAnalyst = Feedback.objects.filter(role = "analyst")

            average_ratings_Method = allFeedback.values('method').annotate(avg_rating=Avg('rating')).order_by('-avg_rating', 'method')

            misclassified_ids = []
            for feedback in allFeedback:
                if not feedback.classifiedCorrectly:
                     misclassified_ids.append(feedback._id)

            allGoals = Expectations.objects.all().values('goal_Expect').annotate(count=Count('_id')).order_by('-count', 'goal_Expect')
            allGoalsExplorer = Expectations.objects.filter(role = "explorer").values('goal_Expect').annotate(count=Count('_id')).order_by('-count', 'goal_Expect')
            allGoalsAnalyst = Expectations.objects.filter(role = "analyst").values('goal_Expect').annotate(count=Count('_id')).order_by('-count', 'goal_Expect')

            expectationsMethodAnalyst = Expectations.objects.filter(role = "analyst").exclude(method_Expect="[]").values('method_Expect').annotate(count=Count('_id')).order_by('-count', 'method_Expect')
            

            number_Feedback = len(allFeedback)
            number_Feedback_Explorer = len(allFeedbackExplorer)
            number_Feedback_Analyst = len(allFeedbackAnalyst)

            number_Users = User.objects.count()
            number_Explorer = User.objects.filter(role = "explorer").count()
            number_Analyst = User.objects.filter(role = "analyst").count()

            average_ratings_Explorer = 0
            if len(allFeedbackExplorer) > 0:
                average_ratings_Explorer = allFeedbackExplorer.aggregate(avg_rating=Avg('rating'))['avg_rating']

            average_ratings_Analyst = 0
            if len(allFeedbackAnalyst):
                average_ratings_Analyst = allFeedbackAnalyst.aggregate(avg_rating=Avg('rating'))['avg_rating']

            percentage_misclassified = 0
            if len(allFeedback) > 0:
                percentage_misclassified = (len(misclassified_ids) / len(allFeedback)) * 100

            return Response({
                'avgRatingMethod': average_ratings_Method,
                'allGoals': allGoals,
                'allGoalsExplorer': allGoalsExplorer,
                'allGoalsAnalyst': allGoalsAnalyst,
                'expectationsMethodAnalyst': expectationsMethodAnalyst,
                'numberFeedback': number_Feedback,
                'numberFeedbackExplorer': number_Feedback_Explorer,
                'numberFeedbackAnalyst': number_Feedback_Analyst,
                'numberUser': number_Users,
                'numberExplorer': number_Explorer,
                'numberAnalyst': number_Analyst,
                'avgRatingExplorer': average_ratings_Explorer,
                'avgRatingAnalyst': average_ratings_Analyst,
                'percentageMisclassified': percentage_misclassified,
            }, status=200)
        else:
                raise ValueError("No GET request was sent")
    except ValueError as error:
        return Response({'error': str(error)}, status=400)    


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getStatisticsForGoal(request):            
    try:
        if request.method == 'GET':
            user = get_object_or_404(User, username=request.user.username)
            
            if user.is_staff != True:
                raise ValueError('You are not authorized for this request.')

            query_params = request.query_params
            print("Query parameters:", query_params)
            goal_Expect = query_params.get("goalExpect")
            role = query_params.get("role")
            classification = query_params.get("classification")
            if (goal_Expect != " "):
                print(goal_Expect)
                filteredExpectationsId = list(Expectations.objects.filter(goal_Expect=goal_Expect).values_list('user', flat=True))
                print(filteredExpectationsId)
            else:
                 filteredExpectationsId = list(Expectations.objects.values_list('user', flat=True))

            if (role==" "):
                allFeedback = Feedback.objects.filter(user__in=filteredExpectationsId)
            elif (role=="explorer"):
                allFeedback = Feedback.objects.filter(role = "explorer", user__in=filteredExpectationsId)
            else:     
                allFeedback = Feedback.objects.filter(role = "analyst", user__in=filteredExpectationsId)

            if classification and classification!=" ":
                filtered_ids = []
                for feedback in allFeedback:
                    if classification=="false" and not feedback.classifiedCorrectly:
                        filtered_ids.append(feedback._id)
                    elif classification=="true" and feedback.classifiedCorrectly:
                        filtered_ids.append(feedback._id)
                allFeedback = allFeedback.filter(_id__in=filtered_ids)

            print(allFeedback)
            average_ratings_Method = allFeedback.values('method').annotate(avg_rating=Avg('rating')).order_by('-avg_rating', 'method')

            return Response({
                'filteredMethods' : average_ratings_Method,
            }, status=200)
        else:
                raise ValueError("No GET request was sent")
    except ValueError as error:
        return Response({'error': str(error)}, status=400) 