function getTimeString(time) {
  const hour = parseInt(time / 3600);
  let remainingSecond = parseInt(time % 3600);
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName('category-btn');
  for (let button of buttons) {
    button.classList.remove('active');
  }
};

const loadCategories = () => {
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(response => response.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error));
};

const loadVideos = (searchText = '') => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then(response => response.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error));
};

const loadCategoryVideos = id => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(response => response.json())
    .then(data => {
      removeActiveClass();
      const activeButton = document.getElementById(`btn-${id}`);
      activeButton.classList.add('active');
      console.log(activeButton);
      displayVideos(data.category);
    })
    .catch(error => console.log(error));
};

const loadDeatils = async videoId => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const response = await fetch(url);
  const data = await response.json();
  displayDetails(data.video);
};

const displayDetails = video => {
  const detailsContainer = document.getElementById('modal-content');

  detailsContainer.innerHTML = `
  <img src=${video.thumbnail} />
  <p>${video.description}</p>
  `;
  // way 1
  // document.getElementById('showModalData').click();

  // way 2
  document.getElementById('customModal').showModal();
};

const displayVideos = videos => {
  const videoContainer = document.getElementById('videos');
  videoContainer.innerHTML = '';

  if (videos.length === 0) {
    videoContainer.classList.remove('grid');
    videoContainer.innerHTML = `
    <div class="min-h-[300px] w-full flex flex-col gap-5 justify-center items-center">
    <img src="assets/Icon.png"/>
    <h2 class="text-center font-bold text-2xl">NO Content here in this Category</h2>
    </div>
    `;
    return;
  } else {
    videoContainer.classList.add('grid');
  }
  videos.forEach(video => {
    const card = document.createElement('div');
    card.classList = 'card card-compact';
    card.innerHTML = `
    <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail} class="h-full w-full object-cover"/>
      ${
        video.others.posted_date?.length === 0
          ? ''
          : `<span class="absolute right-2 bottom-2  text-white  bg-black rounded p-1 text-xs
          ">
      ${getTimeString(video.others.posted_date)}
      </span>`
      }
    
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
      <img class="h-10 w-10 rounded-full object-cover" src="${
        video.authors[0].profile_picture
      }"/>
    </div>
    <div>
    <h2 class="font-bold">${video.title}</h2>
    <div class="flex gap-2 items-center">
    <P class="text-gray-400">${video.authors[0].profile_name}</P>
    
    ${
      video.authors[0].verified === true
        ? '<img class="w-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png" />'
        : ''
    }
      </div>
      <p><button onclick="loadDeatils('${
        video.video_id
      }')" class="btn btn-sm btn-error">Details</button></p>
    </div>
  </div>
    `;
    videoContainer.append(card);
  });
};

const displayCategories = categories => {
  const categoryContainer = document.getElementById('categories');
  categories.forEach(item => {
    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">${item.category}</button>
    `;
    categoryContainer.append(buttonContainer);
  });
};

document.getElementById('search-input').addEventListener('keyup', event => {
  console.log(event.target.value);
});

loadCategories();
loadVideos();
