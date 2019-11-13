import requests
from bs4 import BeautifulSoup as bs
from collections import defaultdict
import json

data = defaultdict()
url = 'https://deadbydaylight.gamepedia.com/Add-ons'

site = bs(requests.get(url).content, 'lxml')
table = site.find('div', {'class': 'mw-parser-output'})
table = table.find_all('table', {'class':'wikitable'})[1]
table = table.find('tbody')

k = -1
for tr in table.contents:
    try:
        text = tr.text
        k += 1
    except:
        continue
    if k%3 == 0:
        temp = defaultdict()
        temp['power'] = tr.text.strip()
    elif k%3 == 1:
        th = tr.find_all('th')
        killer = th[0].a['title']
        temp['killer-image'] = th[0].img['src']
        temp['power-image'] = th[1].img['src']
        temp['power-description'] = tr.find('td').text.strip()
    else:
        temp['addons'] = defaultdict(list)
        tb = tr.find('table')
        tb = tb.find('tbody')
        for tr in tb.find_all('tr')[1:]:
            tempp = defaultdict()
            th = tr.find_all('th')
            td = tr.find_all('td')
            tempp['addon-image'] = th[0].img['src']
            tempp['addon-name'] = th[1].text.strip()
            addon_rarity = td[0].text.strip()
            tempp['addon-description'] = td[1].text.strip()
            temp['addons'][addon_rarity].append(tempp)

        if killer in data.keys():
            killer = 'Ghostface'
        data[killer] = temp

ddd = {}
keys = sorted(data.keys())
for key in keys:
    ddd[key] = data[key]

with open(r"Killer_Addons.json", "w") as f:
    json.dump(ddd, f)
