let url = "https://api.github.com/users/";

const form = document.querySelector("#form");
const input = document.querySelector(".profile-search");
const cardContainer = document.querySelector(".profile-card");
const repos = document.querySelector("repos");


async function getProfile(pName){
    let dataJSON;
    try{
        let data = await fetch(url + pName);
        dataJSON = await data.json();
    }catch(err){
        return new Error(err);
    }
    return dataJSON;
}

form.addEventListener("submit", (e) => {
    if(input.value != ""){
        getProfile(input.value)
        .then((data) => {
            if(data.message == "Not Found"){
                throw new Error(`${input.value} ${data.message}.`);
            }
            getRepos()
            .then((reposString) => {
                changeProfileUI(data,reposString);
            }).catch((err) => {
                changeProfileUI(data,err);
            })
            
        }).catch(err => {
            getErrorCard();
            console.log(err);
        })
    }
    e.preventDefault();
})

function changeProfileUI(data,reposString){

    let html = `
        <div class="card-container">
            <div class="profile-card">
                <div class="profile-header">
                    <img src="${data.avatar_url}" alt="profile" class="profile-img">
                </div>

                <div class="profile-card-body">
                    <div class="profile-name">${data.login}</div>
                    <div class="profile-info">${data.bio || "No biography attached."}</div>
                    <div class="profile-social">
                        <div class="profile-follower">${data.followers} followers</div>
                        <div class="profile-following">${data.following} following</div>
                        <div class="profile-repos">${data.public_repos} repos</div>
                    </div>

                    <div class="repos">
                        ${reposString}
                    </div>
                </div>  
            </div>
        </div>
    `;

    cardContainer.innerHTML = html;
}

async function getRepos(){
    let url = `https://api.github.com/users/${input.value}/repos`;

    let repos = await fetch(url);
    let reposJSON = await repos.json();
    reposJSON = await reposJSON.splice(0,5);
    let repoString = "";
    for(let repo of reposJSON){
        let url = repo.git_url;
        repoString += `<a href="https:${String(url).slice(4,url.length)}" class="repo">${repo.name}</a>`;
    }
    return repoString;
}


function getErrorCard(){
    let html = `
        <div class="card-container" style="font-size:2.5rem; text-align: center;">
            ${input.value} was not found.
        </div>
    `;
    cardContainer.innerHTML = html;
}
