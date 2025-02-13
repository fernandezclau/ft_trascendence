# from django.shortcuts import render, redirect
# from django.contrib.auth import login
#
#
# def index(request):
#     return render(request, 'index.html')
#
# def spa_content(request, page):
#     templates = {
#         "home": "pages/home.html",
#         "tournament": "pages/tournament.html",
#         "login": "pages/login.html",
#         "dashboard": "pages/dashboard.html",
#         "settings": "pages/settings.html",
#         "register": "pages/register.html",
#         "info": "pages/info.html",
#     }
#     template = templates.get(page, "pages/not_found.html")
#     return render(request, template)
from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegistroForm

def registro(request):
    if request.method == "POST":
        form = RegistroForm(request.POST)
        if form.is_valid():
            print(f"This is the form: {form.is_valid()}")
            user = form.save()
            login(request, user)  # Autologin después del registro
            return redirect("home")  # Redirigir a la página principal
        else:
            print(f"This is the form: {form.is_valid()}")
            print(f"This is the errors: {form.errors}")
    else:
        form = RegistroForm()
    return render(request, "registro.html", {"form": form})
