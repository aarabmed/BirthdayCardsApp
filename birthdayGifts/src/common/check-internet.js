export  const doesConnectionExist=()=>{
    return new Promise(resolve => {
        const isOnline = () => resolve(true);
        const isOffline = () => resolve(false);

        var xhr = new XMLHttpRequest();
        var file = "https://i.imgur.com/7ofBNix.png";
        var randomNum = Math.round(Math.random() * 10000);
    
        
        xhr.onerror = isOffline;
        xhr.ontimeout = isOffline;

        xhr.addEventListener("readystatechange", processRequest, false);
    
        function processRequest(e) {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 304) {
                    
                    isOnline()
                }else{
                    
                    isOffline()
                }
            }
        }

        xhr.open('HEAD', file + "?rand=" + randomNum, true);
        //xhr.open("POST",  file + "?rand=" + randomNum, true);
        xhr.timeout=2000
        xhr.send();


    })
    
}