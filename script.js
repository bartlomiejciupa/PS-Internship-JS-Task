'use strict';

const userInput = document.querySelector('.nb-news-input');
const newsList = document.querySelector('.news-list');
const loading = document.querySelector('.loading');
const container = document.querySelector('.container');

userInput.addEventListener('change', loadNews);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight) {
    showLoading();
  }
});

let newsNumber;
if (userInput.value) {
  newsNumber = userInput.value;
} else {
  newsNumber = 15;
}
console.log(newsNumber);
console.log(userInput.value);

function showLoading() {
  loading.classList.add('show');
  setTimeout(loadNews, 1000);
}
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
const showCounter = (data) => {
  const counter = document.createElement('span');
  counter.classList.add('articles-counter');
  counter.innerText = 'Number of articles: ' + data;
  container.appendChild(counter);
  let counterLoadedNews = document.createElement('p');
  counterLoadedNews.textContent = newsNumber;
  counter.appendChild(counterLoadedNews);
};

function loadNews() {
  let url = `https://api.spaceflightnewsapi.net/v3/articles?_limit=${newsNumber}`;

  let urlTest = 'https://api.spaceflightnewsapi.net/v3/articles';
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showNews(data);
      console.log(data.length);
    })
    .catch((error) => {
      console.log(error);
    });
}
loadNews();

function loadCounter() {
  let url = `https://api.spaceflightnewsapi.net/v3/articles/count`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      showCounter(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
loadCounter();
