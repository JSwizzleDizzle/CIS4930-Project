# CIS4930 Project
Group project for CIS4930 Internet Computing  

## Project Description
Terminal Illness is a web-based game where...  

## Project Structure

### Modules
All JavaScript objects/abstractions should be placed in separate modules to minimize internal JavaScript. Internal JavaScript should be strictly reserved for game initialization. The modules existing thus far are:  

#### BaseWindow
Serves as the basic framework for all in-game windows. Contains and genrates its own HTML elements as well as the event listeners necessry for basic user interaction.  

#### Terminal
The class which manages the terminal, the main aspect of the game. Facilitates user input and the logic required for executing commands.  

#### Desktop
The container for the entire client-side game state. Contains all windows in a registry so that windows may be restricted to the game screen and to manage window-window interaction.  

#### ResourceManager
Currently serves as a container for the readFile() function which can take a file on the server and return its text content to the client via AJAX.  

#### Vec2
Represents a 2D vector. Supports common vector operations.  

#### NameTree
A tree that supports an limitless number of children per node. Node children are indexed by name, hence "NameTree". Made specifically for the file system but would also be useful for sprite animation if time permits.  

#### FileSystem
A wrapper around NameTree that specifically mimics a file system. Nodes of the tree have directories as data. The nodes store the child directories, while the directories themselves store text files (which will at some point be "enemies").  


### Resources
Resources (i.e. files to be read from during game execution) are stored in the resources folder. The ResourceManager object (which currently behaves more like a namespace for its function) can read from these files and output the text as necessary.  


### Images
Images are kept in their own folder. Currently images are simply broken into icons and non-icons.  


### Content


### Style
For the overall website, it would probably be best to use a front-end library such as Bootstrap for stylistic purposes.  
However, for in-game HTML elements, it is best to use custom CSS over libraries such as Bootstrap, as game elements are designed to mimic the Windows OS interface rather than serve the same aesthetic as a general website.  
