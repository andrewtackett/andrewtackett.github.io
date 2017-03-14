This is where I'll be keeping track of my progress on my Natural Language Processing Semester project.  The current timeline is below:

Proposed Timeline Milestones:

* 2/21 - Gather all chapter summaries from ASOIAF wiki (will have to write python scraper for this) [**DONE**]

* 3/2 - Write reddit bot to scan subreddit and parse out relevant thread info for processing, i.e. thread original post text, response comments text, spoilers tags, etc. [**DONE**]

* 3/14 - Research and choose approaches to extract and recognize spoilers (topic modeling/recognition, named-entity recognition, event extraction/recognition) [**DONE**]

* 4/13 - Write main stage of program to identify spoilers

* 4/20 - Evaluate and refine as necessary

-----------------------------------------------------------------------------------------------

Log:

2/20 - Wrote python scraper to gather chapter summaries

2/24 - Wrote Reddit bot to gather thread data for analysis

2/28 - Looking at methods for event co-reference recognition (Latent Dirichlet Allocation)

3/14 - After looking at various papers on topic modeling I've decided to use a hierarchical dirichlet process model with Gibbs sampling to cluster spoiler and actual texts and then assign spoilers to the Book and Chapter text in that cluster
