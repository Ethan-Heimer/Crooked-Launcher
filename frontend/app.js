let currentSelected = 0;

const inputForm = document.getElementById("input-form")
const input = document.getElementById("input");

const output = document.getElementById("output")
const body = document.body;

const search = document.getElementById("search")

OnStart();
async function OnStart(){
    input.focus();
    input.addEventListener('input', (e) => {
        const value = input.value;

        GetApps(value, output, 0)
        currentSelected = 0
    })

    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
    })

    document.addEventListener('keydown', (event)=>{
        if(event.keyCode === 40){
            event.preventDefault()
            currentSelected = UpdateSelection(currentSelected, currentSelected+1, output)
        }

        if(event.keyCode === 38){
            event.preventDefault()
            currentSelected = UpdateSelection(currentSelected, currentSelected-1, output)
        }

        if(event.keyCode == 27){
            event.preventDefault()
            window.API.Exit();
        }

        if(event.keyCode === 13){
            OpenSelected(currentSelected, output);
            window.API.Exit();
        }

    })

    window.addEventListener("blur", () => {
        window.API.Exit();
    });

}

async function GetApps(pattern, output, defaultSelection){
    const response = await window.API.Grep(pattern)

    ClearButtons(output);
    CreateButtons(output, response['results'])

    UpdateSelection(0, defaultSelection, output)
}

async function OpenApp(name){
    await window.API.Open(name);
}

function UpdateSelection(currentSelected, selection, output){
    let options = [...output.children];

    if(selection < 0)
        return currentSelected;
    if(selection >= options.length)
        return currentSelected

    if(currentSelected >= 0){
        options[currentSelected].classList.remove('selected')
        options[selection].classList.add('selected')

        return selection
    }

    return 0
}

function OpenSelected(currentSelected, output){ 
    let options = [...output.children];

    if(currentSelected >= 0)
        options[currentSelected].click();
}

function CreateButtons(parent, options){
    const length = options.length;

    for(let i = 0; i < length; i++){
        const button = document.createElement('button');
        button.innerText = options[i].name;
        button.classList.add("app-button")

        button.onclick = () => {
            OpenApp(options[i].application)
            window.API.Exit();
        }

        parent.appendChild(button)
    }
}

function ClearButtons(parent){
    parent.textContent='';
}
