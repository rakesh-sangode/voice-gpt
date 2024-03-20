import json 
import random

# get recent messages
def get_recent_messages():

    # define the file name and learn instruction
    file_name = "stored_data.json"
    learn_instruction = {
        "role": "system",
        "content": "You are interviewing the user for a job as a python developer. Ask short questions that are relevant to junior python developer. Your name is Sara. The user is called Rakesh. Keep your answers to under 30 words."
    }

    # initialize messages
    messages = []

    # add a random element
    # x = random.uniform(0, 1)
    # if x < 0.5:
    learn_instruction["content"] = learn_instruction["content"] + " Your response will include some dry humour."
    # else:
    #     learn_instruction["content"] = learn_instruction["content"] + " Your response will include a rather challenging question."
    
    # append instruction to message
    messages.append(learn_instruction)

    # get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            # append last 5 items of data
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as e:
        print("Error Occured: ", e)
        pass

    # return messages
    return messages

# store messages
def store_messages(request_message, response_message):
    # define the file name 
    file_name = "stored_data.json"

    # get recent messages
    messages = get_recent_messages()[1:]

    # add messages to data
    user_message = {"role": "user", "content": request_message}
    assistant_message = {"role": "assistant", "content": response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    # save the updated file
    with open(file_name, "w") as f:
        json.dump(messages, f)

# reset messages
def reset_messages():
    # overwrite current file with nothing
    open("stored_data.json", "w", )