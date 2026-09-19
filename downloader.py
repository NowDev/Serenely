import os
import requests

sounds = ['airplane', 'bonfire', 'brownnoise', 'bubbles', 'cicadas', 'cityscape', 'coffeeshop', 'fan', 'fireplace', 'forest', 'leaves', 'oceanwaves', 'pinknoise', 'rain', 'rainontent', 'seaside', 'spaceengine', 'summernight', 'thunderstorm', 'train', 'tropicalforest', 'underwater', 'washingmachine', 'water', 'waterfall', 'waterstream', 'whitenoise', 'wind']
path = 'C:\\Users\\<UserName>\\Documents\\Noisli'
url = "https://cdn2.noisli.com/hls/"

# iterate each sound on sounds list
for sound in sounds:
    # download ts sound files of sounds list
    for i in range(0, 121):
        it = str(i)
        # create a request to the url with the get method using Chrome user agent string
        r = requests.get(url + sound + "/hls_" + it + ".ts", headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.noisli.com/',
            'Origin': 'https://www.noisli.com' })
        if r.status_code == 200:
            # save the file on disk
            print('[+] Salvando ' + sound + ' hls ' + it + '.ts')
            # check if folder exists, if not, create it
            if not os.path.exists(path + '\\' + sound):
                os.makedirs(path + '\\' + sound)
            # check if file exists, if not, create it
            if not os.path.isfile(path + '\\' + sound + '\\hls_' + it + '.ts'):
                with open(path + '\\' + sound + '\\hls_' + it + '.ts', 'wb') as f:
                    f.write(r.content)
            else:
                print('[!] Arquivo ' + sound + ' hls ' + it + '.ts já existe!')
                break
        else:
            print('[-] Erro ao baixar ' + sound + ' hls ' + it + '.ts')
            break
