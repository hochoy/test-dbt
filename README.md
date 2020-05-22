Welcome to your new dbt project!

### Using the starter project

Try running the following commands:
- dbt run
- dbt test


### Resources:
- Learn more about dbt [in the docs](https://docs.getdbt.com/docs/introduction)
- Check out [Discourse](https://discourse.getdbt.com/) for commonly asked questions and answers
- Join the [dbt community](http://community.getbdt.com/) to learn from other analytics engineers
- Find [dbt events](https://events.getdbt.com) near you
- Check out [the blog](https://blog.getdbt.com/) for the latest news on dbt's development and best practices

### Instructions for test_run.js:
These are the steps taken to create this repo:

dbt version: 0.15.2

```
brew update
brew tap fishtown-analytics/dbt
brew install dbt
dbt init ./test-dbt

cd ./test-dbt

echo "{% macro macro1(input) %}
  SELECT {{ input }}
{% endmacro %}" > macros/macro1.sql

// create test_run.js
npm init
npm i axios uuid
touch test_run.js


// run test_run.js
dbt rpc
node test_run.js
```