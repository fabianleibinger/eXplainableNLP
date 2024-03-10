""" from django.contrib import admin
from .models import User, Expectations, Feedback

# Register your models here. This file will contain in the future how the admin interface of this project is gonna look like

admin.site.register(User)
admin.site.register(Expectations)
admin.site.register(Feedback)


class YourModelAdmin(admin.ModelAdmin):

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('statistics/', self.admin_site.admin_view(self.statistics_view), name='statistics'),
        ]
        return custom_urls + urls

    def statistics_view(self, request):
        # Hier können Sie Daten aus Ihrer MongoDB abrufen und für das Diagramm vorbereiten
        # Verwenden Sie dann eine Vorlage, um die Daten anzuzeigen, und integrieren Sie JavaScript für das Balkendiagramm.
        context = {
            # Hier kommen die Daten für das Diagramm hin
        }
        return render(request, 'admin/statistics.html', context)


         """

from django.contrib import admin
from django.urls import path
from .models import User, Expectations, Feedback

class xnlpAdminSite(admin.AdminSite):
    site_header = 'XNLP Administration'

admin.site = xnlpAdminSite(name='myadmin')

admin.site.register(User)
admin.site.register(Expectations)
admin.site.register(Feedback)