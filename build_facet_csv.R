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

#SAN JOSE CORRECTOR
go_names <- c(rep("SAN JOSE", 5))
go_years <- c(2010, 2011, 2012, 2013, 2014)
go_breaks <- c(6, 7, 12, 22, 21)


write.csv(facet,"city_facet.csv", row.names=FALSE)

#Generate a list of cities and agencies for checkup
cities <- select(combined, everything()) %>%
        group_by(city) %>%
        summarize(agency = unique(agency)) %>%
        arrange(agency)
View(cities)
    