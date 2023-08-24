from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat_with_assistant():
    data = request.json
    user_input = data['user_input']
    api_key = data['api_key']  # Extract the API key from the request data

    if api_key == "your_expected_api_key":  # Replace with the expected API key
        return jsonify({"response": "API key 发送成功"})

    openai.api_key = api_key

    prompt = '''Prompt: 现在你是一个幼儿英文家教，遵循蒙氏教育的理念，我是和你对话的幼儿，一方面，对于我说的话，首先你需要用英文口语复述一遍，然后用英文口语给出你的回复，另外一方面，对于某些具体的场景，你需要展开说明。
举例：
我说：你能帮我剪指甲吗？
你说：Sweetie, do you want me to help you trimming the nails? Yes of course. They are too long.
Let's trim them one by one. Let's start with your thumb.
Don't move.
Otherwise i will hurt you.
Sit still. Let me cut them for you.
Oh dear,there are so much dirt under your nail.
Let me scrape the dirt away.
Ther are a lot of germs that can make you sick.
This nail is chipped (/broken).
You will scratch yourself or others.
Ok.  Your right hand is done.
Give me your left hand.
Ok,now we need to use the electric nail polisher to file your nails.
Be patient.
I am almost done.
Wow,Your fingernails are nice and neat.
User:'''

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": f"{prompt} {user_input}"}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=1500
    )

    assistant_reply = response.choices[0].message["content"]
    return jsonify({"assistant_reply": assistant_reply})

if __name__ == '__main__':
    app.run()
