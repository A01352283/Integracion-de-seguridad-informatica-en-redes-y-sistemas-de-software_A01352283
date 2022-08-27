from langdetect import detect, detect_langs # Used to help detect if the cypher makes sense by detecting the possible language of the message
from collections import Counter # Data structure to keep track of letters. It's a map that counts key repetitions.

# Abecedario: "abcdefghijklmnopqrstuvwxyz " (el espacio cuenta)

# ========================Main Functions======================== #

# Parte 1.1: Implementa el cifrado y descifrado del cesar. Se recomienda que tu programa pueda recibir una letra a usar como llave y un mensaje a encriptar/descrifrar.

#Encrypts a message using Ceasar's Cypher. Takes a character as a key and a message string to encrypt. Can enable visual aid to make sure the cypher is correct
def cifradoCesar(key, msg, visualAid=False):
    #Fixed alphabet so we don't have to make it from a string every time.
    baseAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ']
    
    #Converts all characters to lowercase
    key = key.lower()
    msg = msg.lower()

    #Converts the message string into a list of characters
    msg = list(msg)
        
    #Gets the index of the letter in order to get the number of positions the cypher has to move
    keyIndexInAlphabet = baseAlphabet.index(key)

    #Shifts the alphabet n spaces to the left, based on the position in the alphabet of the given key
    newAlphabet = baseAlphabet[keyIndexInAlphabet:] + baseAlphabet[:keyIndexInAlphabet]

    newMsg = "" #Cyphered message

    #Creates the new message according to the new alphabet
    for letter in msg:
        newMsg += newAlphabet[baseAlphabet.index(letter)]
    
    #(Visual aid) Prints the moved alphabet and the base alphabet
    if visualAid:
        print("\nOriginal string: " + ''.join(msg) + " \nKey: " + key)
        print(baseAlphabet)
        print(newAlphabet)

    return newMsg

# Parte 1.2: Descifrado de cesar
#Letras mas comunes en inglés: ETAOINSHRDLCUMWFGYPBVKJXQZ
#En español: EAOSRNIDLCTUMPBGVYQHFZJÑXWK
#commonLettersEN = [' ', 'e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r', 'd', 'l', 'c', 'u', 'm', 'w', 'f', 'g', 'y', 'p', 'b', 'v', 'k', 'j', 'x', 'q', 'z']
#commonLettersES = [' ', 'e', 'a', 'o', 's', 'n', 'r', 'i', 'l', 'd', 't', 'u', 'c', 'm', 'p', 'b', 'h', 'q', 'y', 'v', 'g', 'f', 'j', 'z', 'x', 'k', 'w']

#Deciphers ceasar's cypher. Takes the message to decrypt. 
def descifradoCesar(msg, visualAid=False):
    # Initial setup
    baseAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ']
    msg = msg.lower() #Turns the message to lowercase
    msg = list(msg) #Converts the message string into a list of characters
    msgLen = len(msg) #Length of the message in characters
    print("______________________________________")

    #Keeps track of the letter repetitions within the message
    letterCounter = Counter()
    letterCounter.update(msg)

    #Visual aid. Shows repetition percentages
    if visualAid:
        #Turns the counts into percentages
        letterCounterPercentage = {}
        for dictKey in letterCounter.most_common(): #Iterates through the keys by order of most common
            letterCounterPercentage[dictKey[0]] = letterCounter[dictKey[0]] * 100 / msgLen #Makes the value of that key a percentage
        
        print(f"Repetition count \n{letterCounter}")
        print(f"\nRepetition percentages {letterCounterPercentage}\n")

    newMsg = "" #String containing the possible decyphered message
    iterations = 0
    #Moves through the most common letters of the cypher by descending order
    for dictKey in letterCounter.most_common():
        iterations += 1
        shiftAmount = baseAlphabet.index(dictKey[0]) + 1 #Calculates the number of letters the alphabet has to shift to the left to make the current likely letter align with the ' ' character, which is one, if not the most used one
        newAlphabet = baseAlphabet[shiftAmount:] + baseAlphabet[:shiftAmount] #Shifts the base alphabet n spaces to the left, based on the position in the alphabet of the given key. This is used to compare indexes to the base alphabet
        
        #Moves through the encrypted message
        for currentChar in msg: #Iterates thourg each character of the encrypted message
            for i in range(len(newAlphabet)): #Iterates through the current shifted alfabet
                if newAlphabet[i] == currentChar: #If the current char of the message matches the character in the current index of the shifted alphabet
                    newMsg += baseAlphabet[i] #Add the letter in the index of the base alphabet, based on the index of the matched letter in the shifted alphabet
                    break
        
        #If the language detection library detects a language
        detectedLan = detect(newMsg)
        if detectedLan != 'no':
        #if detectedLan == 'en' or detectedLan == 'es':

            print(f"\n{newMsg}") #Possible message
            print('Detected '  + detectedLan) 
            print('Key: ' + newAlphabet[0])

            #Asks if the message makes sense, this is to reduce the runtime of program if the solution is found
            while True:
                inp = input("Does the message make sense? (y/n) ").lower()
                if (inp == 'y') or (inp == 'n'): #Does the message make sense? (y/n) 
                    break #Valid answer
                else: 
                    print("Please enter y o n") #Non valid answer

            if inp.lower() == 'y' or inp.lower() == 'yes': #It makes sense
                #More visual aid. Shows the shifted alphabet and the iterations it took to decypher the message
                if visualAid:
                    print(newAlphabet)
                print("Iterations: " + str(iterations))     
                break

            elif inp.lower() == 'n' or inp.lower() == 'no': #It doesn't make sense, continue looking
                newMsg = ""
        else:
            newMsg = ""

    return newMsg

# ========================Auxiliary Functions======================== #

# Creates a list with the given alphabet string.
def doAlph(ogAlph):
    ogAlph = ogAlph.lower() #Turns all the chars into lowercase
    newAlph = []

    for letter in ogAlph:
        newAlph.append(letter)
    
    return newAlph

# Takes the input from a text file and returns a string with the whole file's contents
def buildMsgFromTxt(txtFileName):
    wholeString = ""
    
    with open('.\cipher1.txt') as f:
        wholeString = f.readlines()
        f.close()
    
    wholeString = ''.join(wholeString) #Makes the list into a string

    return wholeString

# ========================Testing Functions======================== #

#Tests for the first excercise
def test1(visualAid=False):
    print("Exercise 1: cyphering to Ceasar's")
    print(cifradoCesar('b', 'abc xyz', visualAid)) #Should be "bcdayz "
    print(cifradoCesar('g', 'This is an encrypted message', visualAid)) #Should be "Znoyfoyfgtfktixdvzkjfskyygmk"
    print(cifradoCesar('c', 'Attack at dawn', visualAid))
    print(cifradoCesar('t', 'Este es un mensaje encriptado', visualAid))
    print(cifradoCesar('z', 'Se supone que este mensaje es uno mas largo asi que no se cuanto tiempo se va a tardar en descifrarlo', visualAid))

def test2(visualAid=False):
    print("Exercise 2: decyphering Ceasar's")
    descifradoCesar("znoyfoyfgtfktixdvzkjfskyygmk", visualAid)
    descifradoCesar("cvvcembcvbfcyp", visualAid)
    descifradoCesar("xklxsxksmfsexfktbxsxfvjahltwg", visualAid)
    descifradoCesar("qcyqsnmlcyoscycqrcykclqzhcycqyslmykzqyjzpemyzqgyoscylmyqcyaszlrmyrgcknmyqcytzyzyrzpbzpyclybcqagdpzpjm", visualAid)

#Tests the functions for all excercises
def testAll(visualAid=False):
    test1(visualAid)

# Tests the cypher using ciper1.txt
def cipher1(visualAid=False):
    
    wholeString = buildMsgFromTxt('cipher1.txt') #Builds string from txt
    newMsg = descifradoCesar(wholeString, visualAid)
    
    #Makes a txt with the solution of the first cypher
    decryptedTxt = open('decryptedCipher1.txt', "w+")
    decryptedTxt.write(newMsg)

#testAll(False)
#test1(True)
test2(False)
#cipher1(False)
