from mentor import ask_ai


print("-" * 40)
print("AI Coding Mentor")
print("-" *40)

while True:
  user = input('\nYou : ')
  if user.lower() == "exit":
    break

  answer = ask_ai(user)

  print("\nMentor:\n")
  print(answer)