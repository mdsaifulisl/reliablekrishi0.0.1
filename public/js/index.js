document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.slider');
  const slidesContainer = document.querySelector('.slides');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let current = 1;
  let interval;

  // first & last
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.id = 'first-clone';
  lastClone.id = 'last-clone';
  slidesContainer.append(firstClone);
  slidesContainer.prepend(lastClone);
  
  const allSlides = document.querySelectorAll('.slide');
  const total = allSlides.length;

  slidesContainer.style.transform = `translateX(-${current * 100}%)`;

  const goToSlide = (i) => {
    current = i;
    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  };

  const next = () => {
    if (current >= total - 1) return;
    current++;
    goToSlide(current);
  };

  const updateDots = () => {
    let dotIndex = (current - 1 + slides.length) % slides.length;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i + 1));
  });

  slidesContainer.addEventListener('transitionend', () => {
    if (allSlides[current].id === 'first-clone') {
      slidesContainer.style.transition = 'none';
      current = 1;
      slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    }
    if (allSlides[current].id === 'last-clone') {
      slidesContainer.style.transition = 'none';
      current = total - 2;
      slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') goToSlide(current - 1);
  });

  const auto = () => {
    interval = setInterval(() => {
      if (current < total - 1) next();
      else clearInterval(interval); // stop after final round
    }, 3000);
  };

  auto();
  updateDots();





  const containers = document.querySelectorAll('.blog-text');

containers.forEach(container => {
  const maxLength = 450; 
  let totalText = '';

  const paragraphs = Array.from(container.querySelectorAll('p'));
  paragraphs.forEach(p => totalText += p.textContent.trim() + ' ');

  let truncatedText = totalText.trim().substring(0, maxLength);

  container.innerHTML = '';

  const newP = document.createElement('p');
  newP.textContent = truncatedText;


  if (totalText.length > maxLength) {
    newP.textContent += '... ';

    const id = container.getAttribute('data-id');
    const readMoreLink = document.createElement('a');
    readMoreLink.href = `/blog/${id}`;
    readMoreLink.textContent = 'more';
    readMoreLink.classList.add('read-more');

    newP.appendChild(readMoreLink);
  }
  container.appendChild(newP);
});

  const disease = document.querySelectorAll('.disease-text');
  disease.forEach(container => {
    const maxLength = 100;
    let totalText = '';
    const paragraphs = Array.from(container.querySelectorAll('p'));

    paragraphs.forEach(p => totalText += p.textContent.trim() + ' ');

    let truncatedText = totalText.trim().substring(0, maxLength) + '...';

    container.innerHTML = '';

    let remaining = truncatedText;
    paragraphs.forEach(p => {
      if (remaining.length <= 0) return;
      const pText = p.textContent.trim();
      let textToUse = remaining.length >= pText.length ? pText : remaining;

      if(textToUse.trim() !== '') {
        const newP = document.createElement('p');
        newP.textContent = textToUse;
        container.appendChild(newP);
      }

      remaining = remaining.slice(textToUse.length).trim();
    });
  });


  const technology = document.querySelectorAll('.technology-text');

  
  technology.forEach(container => {
    const maxLength = 200;
    let totalText = '';
    const paragraphs = Array.from(container.querySelectorAll('p'));

    paragraphs.forEach(p => totalText += p.textContent.trim() + ' ');

    let truncatedText = totalText.trim().substring(0, maxLength) + '...';

    container.innerHTML = '';

    let remaining = truncatedText;
    paragraphs.forEach(p => {
      if (remaining.length <= 0) return;
      const pText = p.textContent.trim();
      let textToUse = remaining.length >= pText.length ? pText : remaining;

      if(textToUse.trim() !== '') {
        const newP = document.createElement('p');
        newP.textContent = textToUse;
        container.appendChild(newP);
      }

      remaining = remaining.slice(textToUse.length).trim();
    });
  });


});



