library(dplyr)

combined <- read.csv("master.csv", stringsAsFactors = FALSE)

cut_these <- c("PLEASANT HILL",
               "SAN RAMON",    
               "WALNUT CREEK", 
               "HAYWARD",
               "ALAMO",
               "DANVILLE",
               "CUPERTINO",
               "LOS ALTOS"
               )
facet <- select(combined, city, year) %>%
    group_by(city,year) %>%
    filter(!(city %in% cut_these)) %>%
    summarize(breaks = n()) %>%
    ungroup() %>%
    arrange(desc(breaks))

print(facet)
write.csv(facet,"city_facet.csv", row.names=FALSE)

#Generate a list of cities and agencies for checkup (don't repeat)
cities <- select(combined, city, agency) %>%
        group_by(city) %>%
        summarize(agency = unique(agency)) %>%
        arrange(agency)
View(cities)
    