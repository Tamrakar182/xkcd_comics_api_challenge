
class DOMInterface {
    constructor() {
        this.form = document.querySelector("#comic-form");
        this.searchField = document.querySelector("#search-input");

        this.title = document.querySelector("#comic-title");
        this.image = document.querySelector("#comic-image");

        this.error = document.querySelector("#error");
        this.formError = document.querySelector("#form-error");
        this.loader = document.querySelector("#loader");

        this.controls = {
            previous: document.querySelector("#request-prev"),
            next: document.querySelector("#request-next"),
            random: document.querySelector("#request-random"),
            first: document.querySelector("#request-first"),
            last: document.querySelector("#request-last")
        };
    };
    
    clearResults() {
        this.title.innerHTML = "Loading ...";
        this.image.src = "";
        this.image.alt = "";
    };

    hideLoader() {
        this.loader.classList.remove('d-flex');
        this.loader.classList.add("d-none");

    };

    showLoader() {
        this.loader.classList.remove('d-none');
        this.loader.classList.add("d-flex");
    };

    showError() {
        this.hideLoader();
        this.formError.innerHTML = "There has been an error, try again!";
    };

    showFormError(message) {
        this.hideLoader();
        this.formError.innerHTML = message;
    }

    hideErrors() {
        this.error.innerHTML = "";
        this.formError.innerHTML = "";
    };

    showComics(data) {
        const { title, img } = data;
        
        this.title.innerHTML = title;
        this.image.src = img;

        if(data.alt) this.image.alt = data.alt;

        this.hideLoader();
    }
};

class requestController{
    constructor() {
        this.DOMInterface = new DOMInterface();
        this.CORSHeader = "https://cors-anywhere.herokuapp.com";
        this.apiURL = "https://xkcd.com";
        this.apiURLFormat = "info.0.json";
        this.superAgent = superagent;
        this.currentComicsNumber = 0;
        this.maxComicsNumber = 0;

        this.getCurrentComics();
        this.registerEvents()
    };
    
    setMaxComicsNumber(number) {
        this.maxComicsNumber = number
    };

    getRandomComicsNumber() {
        const min = 1;
        const max = this.maxComicsNumber;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    };

    setCurrentComicsNumber(number) {
        this.currentComicsNumber = number
    };

    getCurrentComics() {
        const requestURL = `${this.CORSHeader}/${this.apiURL}/${this.apiURLFormat}`;

        this.superAgent.get(requestURL).end((err, res)=> {
            if(err) {
                return this.DOMInterface.showError(err);
            }

            const data = res.body;
            this.DOMInterface.showComics(data);
            this.setCurrentComicsNumber(data.num);
            this.setMaxComicsNumber(data.num);
        });
    };

    getComicsByNumber(number) {
        this.DOMInterface.hideErrors();
        this.DOMInterface.showLoader();
        this.DOMInterface.clearResults();
        const requestURL = `${this.CORSHeader}/${this.apiURL}/${number}/${this.apiURLFormat}`;

        this.superAgent.get(requestURL).end((err,res)=>{
            if(err) {
                return this.DOMInterface.showError();
            }
            const data = res.body;
            this.setCurrentComicsNumber(data.num);
            this.DOMInterface.showComics(data);
        });
    };

    requestPreviousComics() {
        const requestComicsNumber = this.currentComicsNumber - 1;
        if(requestComicsNumber < 1) return;

        this.getComicsByNumber(requestComicsNumber);
    };

    requestNextComics() {
        const requestComicsNumber = this.currentComicsNumber + 1;
        if(requestComicsNumber > this.maxComicsNumber) return;
        this.getComicsByNumber(requestComicsNumber);
    };

    requestComicsById(e) {
        e.preventDefault();
        
        const query = this.DOMInterface.searchField.ariaValueMax;
        if(!query || query === "") return;
        if(query < 1 || query > this.maxComicsNumber) {
            return this.DOMInterface.showFormError(`Try a number between 1 and ${this.maxComicsNumber}`);
        }

        this.getComicsByNumber(query);
    }

    registerEvents() {
        this.DOMInterface.controls.random.addEventListener('click', () => {
            this.getComicsByNumber(this.getRandomComicsNumber());
        });

        this.DOMInterface.controls.first.addEventListener('click', () =>  this.getComicsByNumber(1));
        this.DOMInterface.controls.last.addEventListener("click", () => this.getComicsByNumber(this.maxComicsNumber));

        this.DOMInterface.controls.previous.addEventListener("click", () => this.requestPreviousComics());
        this.DOMInterface.controls.next.addEventListener('click', () => this.requestNextComics());

        this.DOMInterface.form.addEventListener('submit', (e) => this.requestComicsById(e));
    };
};

const comics = new requestController();