'use strict';

const userInput = document.querySelector('.nb-news-input');
const newsList = document.querySelector('.news-list');
const loading = document.querySelector('.loading');
const container = document.querySelector('.container');

userInput.addEventListener('change', (e) => {
  let userNumber = e.target.value;
  console.log(userNumber);
  loadNews(userNumber);
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight) {
    showLoading();
  }
});

function showLoading() {
  loading.classList.add('show');
  setTimeout(loadNews, 1000);
}

function loadNews(userNumber) {
  let newsNumber;
  userNumber ? (newsNumber = userNumber) : (newsNumber = 15);

  let url = `https://api.spaceflightnewsapi.net/v3/articles?_limit=${newsNumber}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showNews(data);
      loadCounter();
    })
    .catch((error) => {
      console.log(error);
    });
}
loadNews();

const showNews = (data) => {
  data.forEach((news) => {
    let wrapper = document.createElement('div');
    let newsTitle = document.createElement('h2');
    let summaryField = document.createElement('p');
    let link = document.createElement('a');

    wrapper.classList.add('wrapper');
    link.textContent = 'Read article';
    link.setAttribute('href', news.url);
    link.setAttribute('target', '_blank');
    newsTitle.textContent = news.title;

    if (news.summary.length - 200 <= 0) {
      summaryField.textContent = news.summary + '...';
    } else {
      summaryField.textContent = news.summary.substring(0, 200) + '...';
    }
    wrapper.append(newsTitle, summaryField, link);
    newsList.appendChild(wrapper);
    loading.classList.remove('show');
  });
};
function loadCounter() {
  let url = `https://api.spaceflightnewsapi.net/v3/articles/count`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      handleCounter(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

const counterOfTotalArticles = document.createElement('span');
counterOfTotalArticles.classList.add('articles-counter');
const counterOfLoadedNews = document.createElement('p');

const handleCounter = (data) => {
  let fetchedArticles = document.querySelector('.news-list').childElementCount;
  refreshCounter(data, fetchedArticles);
  showCounter();
};

const refreshCounter = (data, ...rest) => {
  counterOfTotalArticles.textContent = 'Amount of total articles: ' + data;
  counterOfLoadedNews.textContent = 'Amount of load articles: ' + rest;
};

const showCounter = () => {
  counterOfTotalArticles.appendChild(counterOfLoadedNews);
  container.appendChild(counterOfTotalArticles);
};
