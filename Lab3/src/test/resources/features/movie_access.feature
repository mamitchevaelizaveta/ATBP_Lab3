Feature: Проверка возрастного доступа к фильму

  Background:
    Given фильм с id "tt444"

  Scenario Outline: Проверка доступа зрителя к фильму по возрасту
    Given фильм с id "<movieId>"
    When я получаю возрастной рейтинг фильма
    And я проверяю доступ зрителя с возрастом <age> и параметром withAdult "<withAdult>"
    Then доступ должен быть "<expectedResult>"

    Examples:
      | movieId | age | withAdult | expectedResult |
      | tt003   | 13  | false     | разрешено      |
      | tt003   | 11  | false     | запрещено      |
      | tt003   | 11  | true      | разрешено      |
      | tt555   | 18  | false     | разрешено      |
      | tt555   | 17  | false     | запрещено      |
      | tt555   | 10  | true      | запрещено      |

  Scenario: Фильм не найден
    Given фильм с id "tt101"
    When я получаю возрастной рейтинг фильма
    Then возвращается ошибка 404