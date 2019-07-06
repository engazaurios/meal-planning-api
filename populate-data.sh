#!/bin/bash

readonly API_URL="http://localhost:3000/api"

readonly MEAL_URL="/meals"
readonly CATEGORIES_URL="/categories"

readonly DAY_MENUS_URL="/daymenus"

function show_help(){
  echo "$ meal-planning-api/populate-data.sh"
  echo "  >  Script that helps to populate data based on user's input"
  echo "  >  Options:"
  echo "      --date            : sets the date of the day menu [default: <today>]"
  echo "      --categories      : defines the categories to populate, separate categories by comma and no spaces [default: healthy,normal]"
  echo "      --meals           : defines the meals to populate, separate meals by comma and no spaces [default: breakfast,lunch,dinner]"
  echo "      --get-day-menu    : returns the day menu based on the ID."
  echo "      --get-user-menu   : returns the user menu based on the ID."
  echo "      --get-categories  : returns all the categories."
  echo "      --get-meals       : returns all the meals."
  echo
  echo "  > Examples:"
  echo "    populate-data.sh                                              # Creates a menu day with default values."
  echo "    populate-data.sh --date 2018-06-06                            # Creates a menu day with date 2018-06-06 and populates with default values."
  echo "    populate-data.sh --date 2018-06-06 --categories healthy       # Creates a menu day with date 2018-06-06, category as healthy and populates with default values."
  echo "    populate-data.sh --date 2018-06-06 --meals breakfast,dinner   # Creates a menu day with date 2018-06-06, meals as breakfast,dinner and populates with default values."
  echo "    populate-data.sh --meals breakfast --categories healthy       # Creates a menu day with actual date, meals as breakfast, category as healthy."
}

function get(){
  local url=$1
  echo $(curl -s --header 'Accept: application/json' "${API_URL}/${url}")
}

function post(){
  local url=$1
  local data=$2
  echo $(curl -X POST -s --header 'Content-Type: application/json' --header 'Accept: application/json' "${API_URL}/${url}" -d "${data}")
}

function get_meals(){
  get ${MEAL_URL}
}

function get_meal_id_by_code(){
  local meal_code=$1
  local meals=$(get_meals)
  echo $(echo "${meals}" | jq -r '.[] | select(.code == "'${meal_code}'") | .id')
}

function get_categories(){
  get ${CATEGORIES_URL}
}

function get_category_id_by_code(){
  local category_code=$1
  local categories=$(get_categories)
  echo $(echo "${categories}" | jq -r '.[] | select(.code == "'${category_code}'") | .id')
}

function create_day_menu(){
  local day_date=$1
  local day_data='{"date":"'${day_date}'","status":"pending"}'
  echo $(post ${DAY_MENUS_URL} ${day_data} | jq -r .id)
}

function create_menu(){
  local day_menu_id=$1
  local meal_id=$2
  local category_id=$3

  local title=$(uuidgen)
  local menu_data='{"title":"'${title}'","description":"'${title}' description","price":0,"mealId":"'${meal_id}'","categoryId":"'${category_id}'"}'

  local url="${DAY_MENUS_URL}/${day_menu_id}/menus"
  echo $(post ${url} "${menu_data}")
}

function create_data(){
  local date=$1
  local categories=$2
  local meals=$3

  local day_menu_id=$(create_day_menu ${date})
  for meal in $(echo "${meals}"); do
    for category in $(echo "${categories}"); do
      local menu=$(create_menu "${day_menu_id}" "$(get_meal_id_by_code ${meal})" "$(get_category_id_by_code ${category})")
      echo "Menu $(echo ${menu} | jq -r .id) created to DayMenu: ${day_menu_id}."
    done
  done
}

ACTUAL_DATE="$(date +%F)"
CATEGORIES="$(get_categories | jq -r '.[].code')"
MEALS="$(get_meals | jq -r '.[].code')"

while test $# -gt 0; do
  option=$1

  case "${option}" in
    --help | -h)
      show_help
      exit 0
    ;;
    --date)
      ACTUAL_DATE=$2
    ;;
    --categories)
      CATEGORIES=$(echo $2 | sed "s/,/ /g")
    ;;
    --meals)
      MEALS=$(echo $2 | sed "s/,/ /g")
    ;;
    --get-day-menu)
      echo "NOT YET IMPLEMENTED"
      exit 0
    ;;
    --get-user-menu)
      echo "NOT YET IMPLEMENTED"
      exit 0
    ;;
    --get-categories)
      get_categories
      exit 0
    ;;
    --get-meals)
      get_meals
      exit 0
    ;;
  esac

  shift; shift;
done

create_data "${ACTUAL_DATE}" "${CATEGORIES}" "${MEALS}"



