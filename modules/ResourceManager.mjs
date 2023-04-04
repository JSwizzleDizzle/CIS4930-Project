
/*
* RESOURCE MANAGER:
* We be managing resources sometimes
* Container for static functions dealing with resource (i.e. various file) creation, reading, and manipulation
*/
class ResourceManager
{
    // For reading a text-based file
    static readFile(directory)
    {
        const request = new XMLHttpRequest();
        request.open("GET", directory, false);
        request.send(null);
        if(request.status == 200)
            return request.responseText;
        else
        {
            console.log(`Invalid file URL: ${directory}`);
            return "";
        }
    }
}


export default ResourceManager;
