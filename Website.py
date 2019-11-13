  
from flask import Flask, render_template, url_for
import json

app = Flask(__name__)

with open("static/Survivor_Perks.json", "r") as f:
    survivor_perks = json.load(f)
with open("static/Killer_Perks.json", "r") as f:
    killer_perks = json.load(f)
with open("static/Killer_Addons.json", "r") as f:
    killer_addons = json.load(f)

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html',
                           Perks={'Survivor-Perks': survivor_perks, 'Killer-Perks': killer_perks}, 
                           Killer_Addons=killer_addons, css='home.css')

@app.route("/analysis")
def analysis():
    return render_template('analysis.html', css='analysis.css', perks=survivor_perks)


if __name__ == '__main__':
    app.run(debug=True)