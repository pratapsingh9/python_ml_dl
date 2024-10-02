import requests
from bs4 import BeautifulSoup
from bs4 import *


class WebSrcaping:
    def __init__(self , url):
        self.url = url
        self.res = None
        self.soup = None
    def scrapSite(self):
        try:
            self.res = requests.get(self.url)
            if self.res.status_code == 200:
                print('succcesfully fetched request')
                self.soup = BeautifulSoup(self.res.content , 'html.parser')
            else:
                print("not able to fetched the request")
        except Exception as e:
            print(f'error {e}')
    def getTitle(self):
        if self.soup:
            title = self.soup.find('title')
            return title.text
        else:
            return 'content not found'
    def getLinks(self):
        values = self.soup.find_all('a')
        ans = []
        for i in values:
            ans.insert(i.get('href'))
        return ans