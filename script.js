'use strict';

const userInput = document.querySelector('.nb-news-input');
const newsList = document.querySelector('.news-list');
const loading = document.querySelector('.loading');
const container = document.querySelector('.container');
const getFromLibraryButton = document.createElement('button');
getFromLibraryButton.textContent = 'Get from Library';
getFromLibraryButton.setAttribute('style', 'position: relative');
container.appendChild(getFromLibraryButton);

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

const createContentField = (news, index) => {
  let wrapper = document.createElement('div');
  let newsTitle = document.createElement('h2');
  let newsSite = document.createElement('p');
  let publishedAt = document.createElement('p');
  let button = document.createElement('button');
  let summaryField = document.createElement('p');
  let hyperLink = document.createElement('a');
  let id = news.id;
  wrapper.classList.add('wrapper');
  newsTitle.textContent = news.title;
  newsSite.textContent = news.newsSite;

  function publishedDay() {
    const date = new Date(news.publishedAt);
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return `${year}-${month}-${day}`;
  }

  publishedAt.textContent = publishedDay();
  const idLocalStorageExist = JSON.parse(localStorage.getItem(id));
  button.textContent =
    idLocalStorageExist == null ? 'Add to Library' : 'Remove from Library';

  summaryField.textContent =
    news.summary.length - 200 <= 0
      ? (summaryField.textContent = news.summary + '...')
      : (summaryField.textContent = news.summary.substring(0, 200) + '...');

  hyperLink.textContent = 'Read article';
  hyperLink.setAttribute('href', news.url);
  hyperLink.setAttribute('target', '_blank');
  wrapper.append(
    newsTitle,
    newsSite,
    publishedAt,
    summaryField,
    hyperLink,
    button
  );

  newsList.appendChild(wrapper);
  return {
    button,
    id,
    newsTitle,
    newsSite,
    publishedAt,
    summaryField,
    hyperLink,
  };
};

const handleNews = (data) => {
  data.forEach(function (news, index) {
    const {
      id,
      button,
      newsTitle,
      newsSite,
      publishedAt,
      summaryField,
      hyperLink,
    } = createContentField(news, index);

    getFromLibraryButton.addEventListener('click', (e) => {
      const articleFromLibrary = JSON.parse(localStorage.getItem(id));
      newsList.innerHTML = 'Library';

      if (articleFromLibrary !== null) {
        console.log(articleFromLibrary);
      } else {
        return;
      }
    });

    button.addEventListener('click', (e) => {
      const idLocalStorageExist = JSON.parse(localStorage.getItem(id));

      if (idLocalStorageExist !== null) {
        button.textContent = 'Add to Library';
      } else {
        button.textContent = 'Remove from Library';
      }

      handleLibrary(
        id,
        button,
        newsTitle,
        newsSite,
        publishedAt,
        summaryField,
        hyperLink
      );
    });
  });

  loading.classList.remove('show');
};

function loadNews(userNumber) {
  let newsNumber;
  userNumber ? (newsNumber = userNumber) : (newsNumber = 15);

  let url = `https://api.spaceflightnewsapi.net/v3/articles?_limit=${newsNumber}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      handleNews(data);
      loadCounter();
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
    .then((totalNumber) => {
      handleCounter(totalNumber);
    })
    .catch((error) => {
      console.log(error);
    });
}

const counterOfTotalArticles = document.createElement('span');
counterOfTotalArticles.classList.add('articles-counter');
const counterOfLoadedNews = document.createElement('p');

const handleCounter = (totalNumber) => {
  let fetchedArticlesNumber =
    document.querySelector('.news-list').childElementCount;
  refreshCounter(totalNumber, fetchedArticlesNumber);
  showCounter();
};

const refreshCounter = (number1, ...number2) => {
  counterOfTotalArticles.textContent = 'Amount of total articles: ' + number1;
  counterOfLoadedNews.textContent = 'Amount of load articles: ' + number2;
};

const showCounter = () => {
  counterOfTotalArticles.appendChild(counterOfLoadedNews);
  container.appendChild(counterOfTotalArticles);
};
const handleLibrary = (id, button, ...rest) => {
  let data = [...rest];
  let article = [];

  button.textContent === 'Remove from Library'
    ? data.map((item) => {
        console.log(item);
        article.push(item.outerText);
        window.localStorage.setItem(id, JSON.stringify(article));
      })
    : window.localStorage.removeItem(id);
};
