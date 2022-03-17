/**
 * Bella Lee
 * 1/12/2022
 * Section AH Shriya Kurpad
 *
 * This script fetches characters from An API of Ice and Fire, then checks the alias list
 * and character name. If both are not empty, the user can guess the character's name
 * based on one of their aliases. Increments the counters on the page and displays a message
 * depending on the correctness of the user's response.
 */

'use strict';
(function() {
  window.addEventListener('load', init);
  window.addEventListener('load', requestCharacter);

  let characterName;
  const BASE_URL = 'https://www.anapioficeandfire.com/api/characters/';
  const NUM_CHARACTERS = 2138;
  const SECOND = 1000;

  /**
   * Adds interactivity to the refresh and submit buttons.
   */
  function init() {
    id('refresh-btn').addEventListener('click', requestCharacter);
    id('submit-btn').addEventListener('click', checkGuess);
  }

  /**
   * Requests character with a randomly generated number from An API of Ice and Fire.
   * Checks the status, then parses the response, then processes the data, then increments
   * the total number of characters generated. If any of these steps fail, start over.
   */
  function requestCharacter() {
    let randomNumber = Math.floor(Math.random() * NUM_CHARACTERS);
    let url = BASE_URL + randomNumber;
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .then(incrementCount)
      .catch(handleError);
  }

  /**
   * Checks if the character has both a name and at least one alias, then generates a random
   * alias for the user to guess the character.
   * @param {JSONObject} response - randomly generated JSON Object for a Game of Thrones character.
   * @returns {String} - the String 'rounds' to be passed into the next function.
   * @throws - will throw an error if the name or alias is empty.
   */
  async function processData(response) {
    let aliasContainer = id('alias');
    aliasContainer.innerHTML = '';

    let name = response.name;
    let aliases = response.aliases;

    if (name === '' || aliases[0] === '') {
      throw new Error(await response.text());
    }

    characterName = name;
    let randomNumber = Math.floor(Math.random() * aliases.length);
    let randomAlias = aliases[randomNumber];
    let aliasDisplay = gen('p');
    id('loading').classList.add('hidden');
    aliasDisplay.textContent = randomAlias;
    aliasContainer.appendChild(aliasDisplay);
    return 'rounds';
  }

  /**
   * Checks if the response is valid.
   * @param {JSONObject} res - response to fetch call.
   * @returns {JSONObject} res - the same response that was passed in.
   * @throws - will throw an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Checks if the user's response matches the character's name. Shows a message for
   * one second depending on whether the response is correct. If it is correct, increments
   * number of correct guesses by one.
   */
  function checkGuess() {
    let userInput = id('guess').value;
    let message = id('feedback');
    if (userInput === characterName) {
      incrementCount('score');
      message.textContent = 'Good job, you got it right!';
      id('guess').value = '';
      requestCharacter();
    } else {
      message.textContent = 'Oops, that was incorrect! Enter try again or refresh.';
    }
    setTimeout(function() {
      message.textContent = '';
    }, SECOND);
  }

  /**
   * Requests a new character and shows the loading text to let the user know that the
   * request is still running.
   */
  function handleError() {
    requestCharacter();
    id('loading').classList.remove('hidden');
  }

  /**
   * Increments the count specified by one.
   * @param {String} value - determines which counter to increase.
   */
  function incrementCount(value) {
    let currentCount = id(value);
    let newCount = parseInt(currentCount.textContent) + 1;
    currentCount.textContent = newCount;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns an empty DOM node with the specified type.
   * @param {string} tagName - HTML tag.
   * @returns {object} - empty DOM object of specified type.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();