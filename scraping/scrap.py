import requests
from bs4 import BeautifulSoup
from support import WebSrcaping


# Step 1: Define a class for the scraper
class WebScraper:
    def __init__(self, url):
        self.url = url
        self.response = None
        self.soup = None
        
    def fetchWebPage(self):
        try:
            self.response = requests.get(url=self.url)
            if self.response.status_code == 200:
                print('succes fetched data')
                self.soup = BeautifulSoup(self.response.content , 'html.parser')
            else:
                
                print('error in fetching')
        except Exception as e:
            print(f"error {e}")
            
            
            
    def fetch_content(self):
        try:
            self.response = requests.get(self.url)
            if self.response.status_code == 200:
                print("Successfully fetched the webpage content.")
                self.soup = BeautifulSoup(self.response.content, "html.parser")
            else:
                print(f"Failed to fetch webpage. Status code: {self.response.status_code}")
        except Exception as e:
            print(f"Error occurred: {e}")
    
    # Step 3: Method to get the page title
    def get_title(self):
        if self.soup:
            title = self.soup.find("title").text
            return title
        else:
            return "Content not fetched yet."

    def Title(self):
        if self.soup:
            soup = self.soup
            title = soup.find('title').text
            return title
        else:
            print("error occured in code")
    
    
    def getTitle(self):
        if self.soup:
            soup = self.soup
            title  = soup.find_all('h1',limit=5)
        for i in title:
            print(i)
    # Step 4: Method to get all paragraphs from the page
    def get_paragraphs(self):
        if self.soup:
            paragraphs = self.soup.find_all("p")
            return [p.text for p in paragraphs]
        else:
            return "Content not fetched yet."
    
    # Step 5: Method to get all links on the page
    def get_links(self):
        if self.soup:
            links = self.soup.find_all("a")
            return [link.get("href") for link in links]
        else:
            return "Content not fetched yet."

# Step 6: Usage of the class to scrape the webpage

if __name__ == "__main__":
    scraper = WebScraper("https://pratapblogo.netlify.app/")
    
    scraper.fetch_content()

    title = scraper.get_title()
    print(f"Page Title: {title}")


    paragraphs = scraper.get_paragraphs()
    print("\nParagraphs:")
    for i, paragraph in enumerate(paragraphs, 1):
        print(f"Paragraph {i}: {paragraph}")

    # Get and print all the links
    links = scraper.get_links()
    print("\nLinks on the page:")
    for link in links:
        print(link)

