import json
import os
from app import app
from flask import render_template, url_for

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static/files')
APP_Killer_Addons = os.path.join(APP_STATIC, 'Killer_Addons')
with open(os.path.join(APP_STATIC, 'Survivor_Perks.json'), "r") as f:
  survivor_perks = json.load(f)

with open(os.path.join(APP_STATIC, 'Killer_Perks.json'), "r") as f:
  killer_perks = json.load(f)

with open(os.path.join(APP_STATIC, 'Killer_Addons.json'), "r") as f:
  killer_addons = json.load(f)

with open(os.path.join(APP_STATIC, 'Items.json'), "r") as f:
    items = json.load(f)

killers = dict()
for file in os.listdir(APP_Killer_Addons):
  with open(os.path.join(APP_Killer_Addons, file), "r") as f:
    killers[file[:-5]] = json.load(f)


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
               Killer_Addons=killer_addons,
               Killers=killers,
               Items=items, css='analysis.css')
