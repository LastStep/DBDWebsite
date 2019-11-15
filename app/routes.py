import json
import os
from app import app
from flask import render_template, url_for

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')

with open(os.path.join(APP_STATIC, 'Survivor_Perks.json'), "r") as f:
    survivor_perks = json.load(f)

with open(os.path.join(APP_STATIC, 'Killer_Perks.json'), "r") as f:
    killer_perks = json.load(f)

with open(os.path.join(APP_STATIC, 'Killer_Addons.json'), "r") as f:
    killer_addons = json.load(f)

with open(os.path.join(APP_STATIC, 'Items.json'), "r") as f:
    items = json.load(f)


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html',
                            Perks={'Survivor-Perks': survivor_perks,
                                  'Killer-Perks': killer_perks},
                            Killer_Addons=killer_addons,
                            Items=items, css='home.css')


@app.route("/analysis")
def analysis():
    return render_template('analysis.html', perks=survivor_perks,
                            Killer_Addons=killer_addons, css='analysis.css')
