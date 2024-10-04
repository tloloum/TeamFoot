/******************************************
           === variables globales === 
********************************************/
const EFFECTIF_MAX = 11; //effectif max pour une équipe
const POSTES = ["gardien", "defenseur", "milieu", "attaquant"]; // noms des différents postes
const FORMATION_INITIALE = "433"; // formation choisie par défaut au lancement

let joueurChoisi; // joueur choisi lors d'un click dans la zone joueurs
let playersData; // data des joueurs

/**
 *
 */
const handleGenreChange = function () {
  const selectedGenre = document.getElementById("genre").value;

  switch (selectedGenre) {
    case "homme":
      playersData = playersDataMen;
      break;
    case "femme":
      playersData = playersDataWomen;
      console.log("Genre sélectionné : Femme");
      break;
    case "mixte":
      playersData = playersDataMen.concat(playersDataWomen);
      console.log("Genre sélectionné : Mixte");
      break;
    default:
      console.log("Sélection non reconnue");
  }
  init();
};

document.getElementById("genre").addEventListener("change", handleGenreChange);

/**
 * initialisation
 */
const init = function () {
  raz();
  remplirPostes(FORMATION_INITIALE);
  const ok = document.getElementById("ok");
  ok.addEventListener("click", changeFormation);
};

/*****************************************************
           === Réinitialisation de la page=== 
******************************************************/

/**
 * Mise à l'état initial (feuille de match, effectifs et joueurs)
 * lors d'un changement de formation
 */
const raz = function () {
  razZoneJoueurs();
  abonneClickJoueurs();
  viderFeuilleDeMatch();
  effectifsA0();
};

/**
 * vide la feuille de match
 */
const viderFeuilleDeMatch = function () {
  var ul = document.querySelector("#feuilleDeMatch ul");
  ul.innerHTML = "";
};

/**
 * Réinitialise tous les effectifs du tableau HTML à 0
 */
const effectifsA0 = function () {
  var cells = document.querySelectorAll("table tbody tr td");
  cells.forEach(function (cell) {
    cell.innerHTML = "0";
  });
};

/**
 * Vide la <div> d'id "joueurs" puis la remplit à partir des données
 * présentes dans le script utilisé : "men.js" ou "women.js"
 */
const razZoneJoueurs = function () {
  const joueurs = document.getElementById("joueurs");
  joueurs.innerHTML = "";
  for (let i = 0; i < playersData.length; i++) {
    joueurs.appendChild(creerJoueur(playersData[i]));
  }
};

/*****************************************************
           ===Changement de formation=== 
******************************************************/

/**
 *  change la formation présente sur le terrain
 *  puis remet la page dans on état initial.
 */
const changeFormation = function () {
  const input = document.getElementById("formation");
  if (verifFormation(input.value)) {
    remplirPostes(input.value);
    raz();
  }
};

/**
 * Détermine si la formation de l'équipe est valide
 * 3 caractères correspondants à des nombres entiers
 * de défenseurs, milieu et attaquants sont attendus :
 * - Les défenseurs sont 3 au moins, 5 au plus
 * - Les milieux : 3 au moins, 5 au plus
 * - Les attaquants : 1 au moins, 3 au plus
 * (Le gardien est toujours unique il n'est pas représenté dans la chaine de caractères).
 * @param {String} formation - la formation à tester provenant de l'input correspondant
 * @return {Boolean} - true si la formation est valide, false sinon
 */
const verifFormation = function (formation) {
  if (
    formation[0] < 3 ||
    formation[0] > 6 ||
    formation[1] < 3 ||
    formation[1] > 6 ||
    formation[2] < 1 ||
    formation[2] > 3
  )
    return false;
  if (
    parseInt(formation[0]) +
      parseInt(formation[1]) +
      parseInt(formation[2]) +
      1 !==
    EFFECTIF_MAX
  )
    return false;
  return true;
};

/**
 * Remplit les lignes de joueur en fonction de la formation choisie
 * @param {String} formation - formation d'équipe
 */
const remplirPostes = function (formation) {
  const effectifs = [1]; // ajout du gardien
  for (c of formation) effectifs.push(parseInt(c));
  const lignes = document.getElementById("terrain").children;
  for (let i = 0; i < lignes.length; i++) {
    lignes[i].innerHTML = "";
    for (let j = 0; j < effectifs[i]; j++) {
      lignes[i].innerHTML += "<div class='positions " + POSTES[i] + "'></div>";
    }
  }
};

/*****************************************************
           === création des joueurs=== 
******************************************************/

/** Crée une <div> représentant un joueur avec un id de la forme "j-xxxxxx"
 * @param {Object} data - données d'un joueur
 * @return {HTMLElement} - div représentant un joueur
 */
const creerJoueur = function (data) {
  const joueur = document.createElement("div");
  joueur.classList.add("joueur", data.poste);
  joueur.id = "j-" + data.id;
  joueur.innerHTML =
    "<img src='" +
    data.src +
    "' alt='" +
    data.nom +
    "'><div class='nom'>" +
    data.nom +
    "</div><div class='poste'>" +
    data.poste +
    "</div";
  return joueur;
};

/*****************************************************
           ===Sélection des joueurs=== 
******************************************************/

/**
 * Abonne les <div> de class "joueur" à la fonction selectionneJoueur pour un click
 */
const abonneClickJoueurs = function () {
  const joueurs = document.querySelectorAll(".joueur");
  for (let i = 0; i < joueurs.length; i++) {
    joueurs[i].addEventListener("click", selectionneJoueur);
  }
};

/**
 * Selectionne un joueur, change son opacité puis le place sur le terrain
 */
const selectionneJoueur = function () {
  joueurChoisi = this;
  this.style.opacity = "0.3";
  placeJoueur();
  joueurChoisi.removeEventListener("click", selectionneJoueur);
};

/*************************************************************
           ===Modifications des joueurs sur le terrain=== 
************************************************************/

/**
 * Renvoie le noeud correspondant à la position disponible pour placer un
 * joueur sur le terrain ou null si aucune n'est disponible
 * @param {HTMLElement} ligne - une div ligne de joueurs sur le terrain
 * @returns {HTMLElement || null} - une div de class "positions" disponible dans cette ligne
 */
const trouveEmplacement = function (ligne) {
  const positions = ligne.querySelectorAll(".positions");
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].title === "" || positions[i].title === undefined) {
      return positions[i];
    }
  }
  return null;
};

/**
 * Renvoie le noeud correspondant à la
 * ligne où placer un joueur qur le terrain en fonction de son poste
 * @param {String} poste - poste du joueur
 * @returns {HTMLElement} - une div parmi les id #ligne...
 */
const trouveLigne = function (poste) {
  return document.getElementById(
    "ligne" + poste.substring(0, 1).toUpperCase() + poste.substring(1)
  );
};

/**
 * Place un joueur sélectionné par un click sur la bonne ligne
 * dans une <div> de class "positions" avec un id de la forme "p-xxxxx"
 */
const placeJoueur = function () {
  const poste = joueurChoisi.classList[1]; // le poste correspond à la 2ème classe;
  const ligne = trouveLigne(poste);
  const emplacementLibre = trouveEmplacement(ligne);
  if (emplacementLibre) {
    // ajoute le nom du joueur et appelle la fonction permettant de mettre à jour la
    // feuille de match
    const nom = joueurChoisi.querySelector(".nom").textContent;
    emplacementLibre.title = nom;
    const id = joueurChoisi.id;
    ajouteJoueurListe(nom, id);
    // modifier l'image de l'emplacement Libre
    const src = joueurChoisi.querySelector("img").src;
    emplacementLibre.style.backgroundImage = "url(" + src + ")";
    // modifier l'id
    emplacementLibre.id = "p-" + joueurChoisi.id.substring(2);
    // Empecher le click dans la zone joueur, et autorise celui dans la zone terrain pour le joueur choisi
    emplacementLibre.addEventListener("click", deselectionneCompo);
    // mise à jour des effectifs de la table )
    miseAJourEffectifs(poste, true);
  } else joueurChoisi.style.opacity = "";
};

/**
 * Enléve du terrain le joueur sélectionné par un click
 */
const deselectionneCompo = function () {
  const poste = this.classList[1];
  const idJoueur = "j-" + this.id.substring(2);
  const joueur = document.getElementById(idJoueur);
  joueur.style.opacity = "";
  joueur.addEventListener("click", selectionneJoueur);
  enleveJoueurFeuilleMatch(this.title);
  this.removeEventListener("click", deselectionneCompo);
  this.title = "";
  this.style = "";
  this.id = "";
  miseAJourEffectifs(poste, false);
};

/*************************************************************
           ===Mise à jour des effectifs=== 
************************************************************/

/**
 * Met à jour les effectifs dans le tableau lorsqu'un joueur est ajouté
 * ou retiré du terrain.
 * Après chaque modification, une vérification de la composition compléte
 * doit être effectuée et le changement d'image de la feuille de match
 * doit être éventuellement réalisé.
 * @param {String} poste - poste du joueur
 * @param {Boolean} plus - true si le joueur est ajouté, false s'il est retiré
 */
const miseAJourEffectifs = function (poste, plus) {
  if (plus) poste.textContent++;
  else poste.textContent--;
  const effectifs = document.querySelectorAll("table tbody tr td");
  for (let i = 0; i < effectifs.length; i++) {
    if (effectifs[i].className === poste) {
      if (plus) effectifs[i].innerHTML++;
      else effectifs[i].innerHTML--;
      break;
    }
  }
  changeImageComplete(verifCompoComplete());
};

/**
 * Verifie si l'effectif est complet.
 * L'image de la feuille de match est changée en conséquence.
 * @returns {Boolean} - true si l'effectif est au complet, false sinon
 */
const verifCompoComplete = function () {
  const effectifs = document.querySelectorAll("table tbody tr td");
  let sum = 0;
  for (let i = 0; i < effectifs.length; i++) {
    sum += parseInt(effectifs[i].textContent);
  }
  if (sum === EFFECTIF_MAX) return true;
  return false;
};

/*************************************************************
           ===Mise à jour de la feuille de match=== 
************************************************************/

/**
 * Modifie l'image de la feuille de match
 * en fonction de la taille de l'effectif
 * @param {Boolean} complet - true si l'effectif est complet, false sinon
 */
const changeImageComplete = function (complet) {
  const img = document.getElementById("check");
  if (complet) img.src = "images/check.png";
  else img.src = "images/notok.png";
};

/**
 * Enleve un joueur de la feuille de match
 * @param {String} nom - nom du joueur à retirer
 */
const enleveJoueurFeuilleMatch = function (nom) {
  const list = document.querySelectorAll("#feuilleDeMatch ul li");
  for (let i = 0; i < list.length; i++) {
    if (list[i].textContent === nom) {
      list[i].parentNode.removeChild(list[i]);
      break;
    }
  }
};

/**
 * ajoute un joueur à la feuille de match dans un élément
 * <li> avec un id de la forme "f-xxxxx"
 * @param {String} nom - nom du joueur
 * @param {String} id - id du joueur ajouté au terrain de la forme "p-xxxxx"
 */
const ajouteJoueurListe = function (nom, id) {
  const liste = document.getElementById("feuilleDeMatch").querySelector("ul");
  const li = document.createElement("li");
  li.textContent = nom;
  li.id = "f-" + id.substring(2);
  liste.appendChild(li);
  li.addEventListener("click", capitaine);
};

const capitaine = function () {
  const liste = document
    .getElementById("feuilleDeMatch")
    .querySelectorAll("ul li");
  for (let i = 0; i < liste.length; i++) {
    if (liste[i].classList[0]) {
      liste[i].classList.remove("Capitaine");
      liste[i].style.fontWeight = "";
      liste[i].textContent = liste[i].textContent.slice(0, -12);
    }
  }
  this.classList.add("Capitaine");
  this.textContent = this.textContent + " (Capitaine)";
  this.style.fontWeight = "bold";
};

/*************************************************************
           ===Initialisation de la page=== 
************************************************************/

handleGenreChange();
