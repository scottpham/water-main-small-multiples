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
#create matrix
sj <- cbind(go_names, go_years, go_breaks)
#rename columns
colnames(sj) <- c("city", "year", "breaks")
#update facet
facet <- rbind(facet, sj)


short_list <- c("OAKLAND", "SAN FRANCISCO", "SAN JOSE", "BERKELEY")
#pare down for short version
short_facet <- select(facet, everything()) %>%
        filter(city %in% short_list) %>%
        group_by(city,year) %>%
        summarize(breaks = sum(as.numeric(breaks))) %>%
        ungroup() %>%
        arrange(desc(breaks))

write.csv(short_facet,"short_facet.csv", row.names=FALSE)

#Generate a list of cities and agencies for checkup
cities <- select(combined, everything()) %>%
        group_by(city) %>%
        summarize(agency = unique(agency)) %>%
        arrange(agency)
View(cities)
    