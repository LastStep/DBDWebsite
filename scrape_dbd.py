import requests
from bs4 import BeautifulSoup as bs
from collections import defaultdict
import json
data = defaultdict()
url = 'https://deadbydaylight.gamepedia.com/Perks'
site = bs(requests.get(url).content, 'lxml')
table = site.find('div', {'class': 'mw-parser-output'})
table = table.find_all('table', {'class':lambda x: x and 'sortable' in x and 'unsortable' not in x})[-1]
table = table.find('tbody')
for tr in table.find_all('tr')[1:]:
    temp = defaultdict()
    th = tr.find_all('th')
    td = tr.find_all('td')
    temp['teachable'] = th[2].text.strip()
    temp['name'] = th[1].a['title']
    link = 'https://deadbydaylight.gamepedia.com' + th[1].a['href']
    temp['description'] = td[0].text.strip()
    temp['image'] = th[0].img['src']
    key = ''.join([i if i != ' ' else '-' for i in th[1].a['title']])
    print(temp['name'])
    site = bs(requests.get(link).content, 'lxml')
    # table = site.find('div', {'class': 'mw-body'})
    table = site.find_all('table', {'class':'wikitable'})[0]
    table = table.find_all('tbody')[0]
    temp['image-alt'] = table.img['src']
    print(temp['image-alt'])

    data[key] = temp
with open("Killer_Perks.json", "w") as f:
    json.dump(data, f)