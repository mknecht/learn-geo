Learning New Zealand Geography Demo
===================================

Short Intro: A [demo](http://mknecht.github.io/learn-geo/build/html/cities.html#menu) showing some of my ideas on how to learn geography related knowledge.

For an idea on how to learn directions, have a look at my [direction demo](http://mknecht.github.io/learn-geo-direction/).

Works reasonably well with Firefox 31 and Chromium 36. See Tech section below.

Intro
-----

Geography for me boils down to a gaping hole in my mind.
I'm quite illiterate when it comes to the countries and cities
of this planet.
Embarrassing, but since school (because of?) I failed changing that.
It was just very inconvenient to learn.

When I recently started learning at [Memrise](http://www.memrise.com/) I was quite surprised that it was actually fun to learn geography.
While crunching my way thru Eastern Europe, ideas for improvements pestered my mind.
Memrise, after all, is focussed on language learners.

My main problem is that my brain stores images: If I just see a positional map of a country, I don't automatically learn to recognize it in a different context.

These changes I demoed, to rectify that shortcoming:

* Let the learners point out the location on the map itself. This makes sure, they have to actually wrap their mind around it.
* Change the reference system: Use a positional map, or a terrain map, or a blank map. This shakes up associations based solely on one map/image.
* Switch between selecting and pointing: In the former case, the learners see the map filled with markers, all of them valid locations, and they have to identify the correct one. This allows for location-relative associations. In the latter case, the map is empty, and the location must be pointed out. This allows for geography-related associations.

Things I didn't build, but would like to have:

* Different zoom levels to start with. Would further shake up memories too fixed on an image.
* Different maps, same effect.

Tech
----

Part of this project was about me learning about npm, d3, then Angular, Grunt, then Gulp and browserify. That's why the javascript file is so massively huge, leading to awful loading times. Parting thoughts: Been there, done that. Next time bower and simple.

Licenses
--------

The source code is licensed under an MIT license. For details see CODE-LICENSE.

src/images/nz_blank_map.svg
Is my derivation of latter location map from NordNordWest. (I removed the region borders.) I publish it under the same [CC-by-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/deed.de).


Attributions
------------

Thanks to Wikipedia for being one of the few providersd of free maps!

src/images/nz_relief_map.jpg
[Wikipedia](http://de.wikipedia.org/wiki/Datei:New_Zealand_relief_map.jpg)
published under CC-by-SA 3.0 by the users NordNordWest and Виктор В.

src/images/nz_location_map.svg
[Wikipedia](http://de.wikipedia.org/wiki/Datei:New_Zealand_location_map.svg)
published under CC-by-SA 3.0 by the user NordNordWest

[The list of cities on Wikipedia](http://en.wikipedia.org/wiki/List_of_cities_in_New_Zealand), well, plus Oban.


