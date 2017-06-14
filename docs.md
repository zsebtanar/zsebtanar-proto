# Zsebtanár proto ~ documentation

## Input types

## Data structure

```yaml
DB:
  classification:
    subjects:
      {subKey}:
        name: string            # subject name ex: Matematika
        exercises: array
        topics: array           # connected topics
    topic:
      {topicKey}
        name: string            # topic name ex: Gyökvönás
        exercises: array
    grades:                     # school grades 
      {clsKey}: 
        name: string            # grade name ex: 1. osztály
        exercises: array        # list of every exercise that use this classification
    tags:
      {tagKey}:
        exercises: array            
  exercise:
    {key}:
      private:                    # for admins
        _key: string
        _created: date
        _updated: date
        author: userKey
        dependencies: ???
        metadata:
          videoLink: string
          examLink: string
        classification:
          subjects: array
          topics: array
          grades: array
          tags: array
        description: string       # markdown  
        inputType: string
        solution: array
        hints: array
      public:                       # for users -- generated from the private exercise date
        _key: string
        _created: date
        _updated: date
        classification:
          subjects: array
          topics: array
          grades: array
          tags: array
        inputType: string
        htmlDescription: string   # raw html, generated from the private exercise description
        
  users:
    {userKey}:
      name: string
      lastPractice: date
```