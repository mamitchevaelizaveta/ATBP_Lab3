package com.example.Lab3.steps;

import com.example.Lab3.config.CucumberSpringConfiguration;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.Before;
import io.cucumber.java.en.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

public class MovieSteps extends CucumberSpringConfiguration {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;
    private MvcResult movieResponse;
    private MvcResult accessResponse;
    private String movieId;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .build();

        movieId = null;
        movieResponse = null;
        accessResponse = null;
    }

    @Given("фильм с id {string}")
    public void setMovieId(String id) {
        this.movieId = id;
    }

    @When("я получаю возрастной рейтинг фильма")
    public void getMovieRating() throws Exception {
        movieResponse = mockMvc.perform(get("/api/movies/" + movieId))
                .andReturn();
    }

    @And("я проверяю доступ зрителя с возрастом {int} и параметром withAdult {string}")
    public void checkAccess(int age, String withAdult) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("movieId", movieId);
        requestBody.put("viewerAge", age);
        requestBody.put("hasAccompanying", Boolean.parseBoolean(withAdult));

        accessResponse = mockMvc.perform(post("/api/cinema/check-access")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andReturn();
    }

    @Then("доступ должен быть {string}")
    public void verifyAccess(String expected) throws Exception {
        assertEquals(200, accessResponse.getResponse().getStatus());
        String actual = accessResponse.getResponse().getContentAsString();
        assertEquals(expected, actual);
    }

    @Then("возвращается ошибка 404")
    public void check404() {
        assertEquals(404, movieResponse.getResponse().getStatus());
    }
}