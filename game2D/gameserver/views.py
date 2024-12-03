from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'gameserver/main.html')

def game(request, room_name):
    return render(request, 'gameserver/index.html' , {'room_name': room_name})