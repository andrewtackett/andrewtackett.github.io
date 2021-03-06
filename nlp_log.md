This is where I'll be keeping track of my progress on my Natural Language Processing Semester project.  The current timeline is below:

Proposed Timeline Milestones:

* 2/21 - Gather all chapter summaries from ASOIAF wiki (will have to write python scraper for this) [**DONE**]

* 3/2 - Write reddit bot to scan subreddit and parse out relevant thread info for processing, i.e. thread original post text, response comments text, spoilers tags, etc. [**DONE**]

* 3/14 - Research and choose approaches to extract and recognize spoilers (topic modeling/recognition, named-entity recognition, event extraction/recognition) [**DONE**]

* 4/13 - Write main stage of program to identify spoilers [**DONE**]

* 4/20 - Evaluate and refine as necessary [**DONE**]

-----------------------------------------------------------------------------------------------

Log:

2/20 - Wrote python scraper to gather chapter summaries

2/24 - Wrote Reddit bot to gather thread data for analysis

2/28 - Looking at methods for event co-reference recognition (Latent Dirichlet Allocation)

3/14 - After looking at various papers on topic modeling I've decided to use a hierarchical dirichlet process model with Gibbs sampling to cluster spoiler and actual texts and then assign spoilers to the Book and Chapter text in that cluster

3/21 - Continuing reading, collecting resources, and understanding the intuition of nonparametric bayesian models and how to implement them

3/28 - Found gensim implementation of HDP, will use that for now and try to implement my own given enough time.  Got data preprocessed/stemmed and set up the modelling code to find topic distributions for chapter summaries and find distributions for new texts (threads).  Working on smoothing the data for cosine similarity calculations

4/9 - Data is now smoothed allowing for full classification.  Early results seem to indicate that the model is picking up topics in text but needs further refinement.  Working on tweaking the programs to improve intuitive performance evaluation

4/23 - After looking back over the data in more detail it came to my attention that many of the threads collected actually couldn't be classified by a human as pertaining to one specific chapter or contained references to outside information which would make classification difficult.  After narrowing down my input data to only those threads with information from the books (making sure the title contains spoilers main) intuitive performance is much better.
