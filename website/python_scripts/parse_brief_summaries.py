import yaml
import json

brief_summaries = {}

for number in range(30):
    algorigthm_name = "sz-challenge-" + "{:02d}".format(number)
    with open("../static/challenge_algorithms/" + algorigthm_name + ".yaml") as stream:
        try:
            data = yaml.safe_load(stream)
            brief_summaries[algorigthm_name] = data['brief-summary'].strip('\n')

        except yaml.YAMLError as exc:
            print(exc)

with open('../static/brief_summaries.json', 'w') as fp:
    json.dump(brief_summaries, fp)