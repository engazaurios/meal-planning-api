#!/bin/bash

readonly API_URL="http://localhost:3000/api"

readonly MEAL_URL="/meals"
readonly CATEGORIES_URL="/categories"

readonly MENUS_URL="/menus"
readonly DAY_MENUS_URL="/daymenus"
readonly USER_MENUS_URL="/usermenus"

DATA_INFO="populate-data-menus-info.json"

function show_help(){
  echo "$ meal-planning-api/populate-data.sh"
  echo "  >  Script that helps to populate data based on user's input"
  echo "  >  Options:"
  echo "      --date            : sets the date of the day menu [default: <today>]"
  echo "      --to-date         : numbers of days to add [default: 0]"
  echo "      --categories      : defines the categories to populate, separate categories by comma and no spaces [default: healthy,normal]"
  echo "      --meals           : defines the meals to populate, separate meals by comma and no spaces [default: breakfast,lunch,dinner]"
  echo "      --get-day-menu    : returns the day menu based on the ID."
  echo "      --get-user-menu   : returns the user menu based on the ID."
  echo "      --get-categories  : returns all the categories."
  echo "      --get-meals       : returns all the meals."
  echo
  echo "  > Examples:"
  echo "    populate-data.sh                                              # Creates a menu day with default values."
  echo "    populate-data.sh --to-date 5                                  # Creates menu days from those range of dates."
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
  echo $(curl -X POST -s --header 'Content-Type: application/json' --header 'Accept: application/json' "${API_URL}${url}" -d "${data}")
}

function put(){
  local url=$1
  echo $(curl -X PUT -s --header 'Content-Type: application/json' --header 'Accept: application/json' "${API_URL}${url}")
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
  local title=$1
  local description=$2
  local price=$3
  local meal_id=$4
  local category_id=$5

  local menu_data='{"title":"'${title}'","description":"'${description}'","price":'${price}',"mealId":"'${meal_id}'","categoryId":"'${category_id}'"}'
  echo $(post ${MENUS_URL} "${menu_data}" | jq -r .id)
}

function link_day_menu_with_menu(){
  local day_menu_id=$1
  local menu_id=$2

  local url="${DAY_MENUS_URL}/${day_menu_id}/menus/rel/${menu_id}"
  echo $(put ${url} | jq -r .id)
}

function publish_menus(){
  local date=$1;
  local url="${USER_MENUS_URL}/publishdaymenus"
  local data='{"startDate":"'${date}'"}'

  local result=$(post ${url} ${data})
  [[ -z "$(echo ${result} | jq '.userMenus | .message?')" ]] && echo ${result} | jq .
}

function create_data(){
  local date=$1
  local categories=$2
  local meals=$3
  local num_menus=$4

  echo ${date}
  local day_menu_id=$(create_day_menu ${date})
  for i in $(seq 1 ${num_menus}); do
    for meal in $(echo "${meals}"); do
      for category in $(echo "${categories}"); do
        local menus_selected=$(jq '.menus[] | select (.category=="'${category}'" and .meal=="'${meal}'")' ${DATA_INFO} | jq -s .)
        echo ${menus_selected}
        local menus_num=$(echo ${menus_selected} | jq -r '. | length')
        echo ${menus_num}
        local random_menu_num=$(echo $((0 + RANDOM % ${menus_num})))
        echo ${random_menu_num}
        local menu=$(echo ${menus_selected} | jq '.['${random_menu_num}']')

        local menu_title=$(echo ${menu} | jq -r '.title')
        local menu_description=$(echo ${menu} | jq -r '.description')
        local menu_price=$(echo ${menu} | jq -r '.price')

        local menu_id=$(create_menu "${menu_title}" "${menu_description}" "${menu_price}" "$(get_meal_id_by_code ${meal})" "$(get_category_id_by_code ${category})")
        echo ${day_menu_id} ${menu_id}
        local link_id=$(link_day_menu_with_menu ${day_menu_id} ${menu_id})
        echo "${link_id} created."
      done
    done
  done

  publish_menus ${date}
}

FROM_DATE="$(date +%F)"
TO_DATE=0
CATEGORIES="$(get_categories | jq -r '.[].code')"
MEALS="$(get_meals | jq -r '.[].code')"
NUM_MENUS=1

while test $# -gt 0; do
  option=$1

  case "${option}" in
    --help | -h)
      show_help
      exit 0
    ;;
    --date)
      FROM_DATE=$2
    ;;
    --to-date)
      TO_DATE=$2
    ;;
    --menus)
      NUM_MENUS=$2
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

for i in $(seq 0 ${TO_DATE}); do
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    DATE="$(date +%Y-%m-%d -d "${FROM_DATE}+${i} days")"
  else
    DATE="$(date -j -v +${i}d -f "%Y-%m-%d" "${FROM_DATE}" +%Y-%m-%d)"
  fi
    create_data "${DATE}T06:00:00.000Z" "${CATEGORIES}" "${MEALS}" "${NUM_MENUS}"
done
