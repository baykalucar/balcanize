/**
 * WhatsApp Emoji Customizer - Popup Script
 * Handles emoji selection, ordering, and storage
 */

// Default emojis (WhatsApp's original defaults)
const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// Emoji names for search (English and Turkish)
const EMOJI_NAMES = {
  // Smileys
  '😀': 'grinning face gülümseyen yüz mutlu',
  '😃': 'grinning big eyes büyük gözler mutlu',
  '😄': 'grinning smiling eyes gülen gözler',
  '😁': 'beaming grinning teeth dişler',
  '😆': 'grinning squinting sıkılmış',
  '😅': 'grinning sweat ter gülen',
  '🤣': 'rolling floor laughing rofl gülmekten yerlere yatmak kahkaha',
  '😂': 'joy tears sevinç gözyaşı gülmek laugh crying',
  '🙂': 'slightly smiling hafif gülümseme',
  '😊': 'smiling blushing utangaç kızaran',
  '😇': 'smiling halo melek angel innocent masum',
  '🥰': 'smiling hearts kalpler aşk love',
  '😍': 'heart eyes kalp gözler aşk love',
  '🤩': 'star struck yıldız gözler hayran',
  '😘': 'kissing winking öpücük göz kırpan',
  '😗': 'kissing öpücük dudak',
  '😚': 'kissing closed eyes kapalı gözler öpücük',
  '😙': 'kissing smiling öpücük gülümseyen',
  '🥲': 'smiling tear gözyaşı gülümseyen',
  '😋': 'yummy delicious lezzetli yemek dil',
  '😛': 'tongue out dil çıkarma',
  '😜': 'winking tongue dil göz kırpma',
  '🤪': 'zany crazy çılgın deli',
  '😝': 'squinting tongue dil sıkma',
  '🤑': 'money mouth para dolar zengin',
  '🤗': 'hugging face sarılma kucaklama hug',
  '🤭': 'hand over mouth el ağız şaşkın',
  '🤫': 'shushing quiet sessiz sus',
  '🤔': 'thinking düşünen düşünce think',
  '🤐': 'zipper mouth fermuar ağız sessiz',
  '🤨': 'raised eyebrow kaş kaldırma şüpheli',
  '😐': 'neutral face nötr yüz',
  '😑': 'expressionless ifadesiz',
  '😶': 'no mouth ağızsız sessiz',
  '😏': 'smirking sırıtma kurnaz',
  '😒': 'unamused bezgin bıkkın',
  '🙄': 'rolling eyes göz devirmek',
  '😬': 'grimacing yüz buruşturan',
  '🤥': 'lying face yalancı pinokyo',
  '😌': 'relieved rahatlamış huzurlu',
  '😔': 'pensive düşünceli üzgün',
  '😪': 'sleepy uykulu uyku',
  '🤤': 'drooling salya akan',
  '😴': 'sleeping uyuyan uyku sleep',
  '😷': 'mask maske hasta',
  '🤒': 'thermometer termometre ateş hasta sick',
  '🤕': 'bandage bandaj yaralı',
  '🤢': 'nauseated mide bulantısı',
  '🤮': 'vomiting kusma',
  '🤧': 'sneezing hapşırma',
  '🥵': 'hot face sıcak yüz',
  '🥶': 'cold face soğuk yüz',
  '🥴': 'woozy sarhoş başı dönen',
  '😵': 'dizzy baş dönmesi',
  '🤯': 'exploding head patlayan kafa şok mind blown',
  '🤠': 'cowboy kovboy şapka',
  '🥳': 'partying party parti kutlama',
  '🥸': 'disguise kılık değiştirme',
  '😎': 'sunglasses güneş gözlüğü cool havalı',
  '🤓': 'nerd inek gözlüklü',
  '🧐': 'monocle tek gözlük',
  '😕': 'confused kafası karışık',
  '😟': 'worried endişeli',
  '🙁': 'slightly frowning hafif somurtan',
  '☹️': 'frowning somurtan üzgün',
  '😮': 'open mouth açık ağız şaşkın surprised wow',
  '😯': 'hushed şaşkın sessiz',
  '😲': 'astonished şaşkın hayret',
  '😳': 'flushed kızarmış utanmış',
  '🥺': 'pleading yalvaran puppy eyes köpek bakışı',
  '😦': 'frowning open mouth somurtan açık ağız',
  '😧': 'anguished ıstıraplı',
  '😨': 'fearful korkmuş scared',
  '😰': 'anxious sweat endişeli ter',
  '😥': 'sad relieved üzgün rahatlamış',
  '😢': 'crying ağlayan ağlamak sad üzgün tear gözyaşı',
  '😭': 'loudly crying hüngür ağlayan çok ağlama sob',
  '😱': 'screaming çığlık atan korku fear horror',
  '😖': 'confounded şaşkın',
  '😣': 'persevering sabırlı',
  '😞': 'disappointed hayal kırıklığı',
  '😓': 'downcast yüzü düşük',
  '😩': 'weary yorgun',
  '😫': 'tired yorgun bitkin',
  '🥱': 'yawning esneyen sıkılmış bored',
  '😤': 'huffing öfkeli burun duman angry',
  '😡': 'pouting kızgın angry mad öfkeli',
  '😠': 'angry kızgın mad öfke',
  '🤬': 'swearing küfür angry kızgın',
  '😈': 'smiling devil şeytan iblis',
  '👿': 'angry devil kızgın şeytan',
  '💀': 'skull kafatası ölüm dead skeleton iskelet',
  '☠️': 'skull crossbones kafatası korsanlar',
  '💩': 'poop poo kaka dışkı pis',
  '🤡': 'clown palyaço',
  '👹': 'ogre dev canavar',
  '👺': 'goblin cin',
  '👻': 'ghost hayalet boo',
  '👽': 'alien uzaylı',
  '👾': 'space invader uzay istilacısı',
  '🤖': 'robot',
  '😺': 'smiling cat gülen kedi',
  '😸': 'grinning cat sırıtan kedi',
  '😹': 'joy cat sevinçli kedi',
  '😻': 'heart eyes cat aşık kedi',
  '😼': 'smirk cat sırıtan kedi',
  '😽': 'kissing cat öpen kedi',
  '🙀': 'weary cat yorgun kedi',
  '😿': 'crying cat ağlayan kedi',
  '😾': 'pouting cat somurtan kedi',
  
  // Gestures
  '👋': 'waving hand el sallama merhaba hello hi bye bye',
  '🤚': 'raised back hand el arkası',
  '🖐️': 'hand splayed açık el beşlik',
  '✋': 'raised hand kaldırılmış el dur stop',
  '🖖': 'vulcan vulkan spock',
  '👌': 'ok okay tamam',
  '🤌': 'pinched fingers italyan',
  '🤏': 'pinching küçük az',
  '✌️': 'peace victory zafer barış',
  '🤞': 'crossed fingers çapraz parmaklar şans',
  '🤟': 'love you seni seviyorum',
  '🤘': 'rock metal',
  '🤙': 'call me ara beni telefon',
  '👈': 'pointing left sol',
  '👉': 'pointing right sağ',
  '👆': 'pointing up yukarı',
  '🖕': 'middle finger orta parmak küfür',
  '👇': 'pointing down aşağı',
  '☝️': 'index up işaret parmağı',
  '👍': 'thumbs up beğen like iyi good onay approve',
  '👎': 'thumbs down beğenme dislike kötü bad',
  '✊': 'fist yumruk güç power',
  '👊': 'punch yumruk vuruş',
  '🤛': 'left fist sol yumruk',
  '🤜': 'right fist sağ yumruk',
  '👏': 'clapping alkış bravo',
  '🙌': 'raising hands kutlama eller havaya',
  '👐': 'open hands açık eller',
  '🤲': 'palms up avuç yukarı',
  '🤝': 'handshake tokalaşma anlaşma deal',
  '🙏': 'pray folded hands dua teşekkür thanks please namaste',
  '✍️': 'writing yazma',
  '💅': 'nail polish tırnak cila',
  '🤳': 'selfie özçekim',
  '💪': 'flexed biceps kas güçlü strong muscle',
  
  // Hearts
  '❤️': 'red heart kırmızı kalp aşk love sevgi',
  '🧡': 'orange heart turuncu kalp',
  '💛': 'yellow heart sarı kalp',
  '💚': 'green heart yeşil kalp',
  '💙': 'blue heart mavi kalp',
  '💜': 'purple heart mor kalp',
  '🖤': 'black heart siyah kalp',
  '🤍': 'white heart beyaz kalp',
  '🤎': 'brown heart kahverengi kalp',
  '💔': 'broken heart kırık kalp',
  '❣️': 'heart exclamation kalp ünlem',
  '💕': 'two hearts iki kalp',
  '💞': 'revolving hearts dönen kalpler',
  '💓': 'beating heart atan kalp',
  '💗': 'growing heart büyüyen kalp',
  '💖': 'sparkling heart parlayan kalp',
  '💘': 'heart arrow ok kalp cupid',
  '💝': 'heart ribbon kurdele kalp hediye',
  '💟': 'heart decoration kalp dekorasyon',
  
  // Celebration
  '🎉': 'party popper parti konfeti kutlama celebrate',
  '🎊': 'confetti ball konfeti',
  '🎈': 'balloon balon',
  '🎁': 'gift wrapped hediye paketi present',
  '🎀': 'ribbon kurdele',
  '🏆': 'trophy kupa ödül award winner',
  '🥇': 'gold medal altın madalya birinci first',
  '🥈': 'silver medal gümüş madalya ikinci second',
  '🥉': 'bronze medal bronz madalya üçüncü third',
  '🏅': 'sports medal spor madalya',
  
  // Fire & Nature
  '🔥': 'fire ateş yangın hot sıcak lit',
  '⭐': 'star yıldız',
  '🌟': 'glowing star parlayan yıldız',
  '✨': 'sparkles parıltı',
  '💫': 'dizzy star dönen yıldız',
  '💥': 'collision patlama boom bang',
  '💦': 'sweat droplets ter damlası su water',
  '💨': 'dashing rüzgar hız fast',
  
  // Animals
  '🐶': 'dog face köpek yüzü',
  '🐱': 'cat face kedi yüzü',
  '🐭': 'mouse face fare yüzü',
  '🐹': 'hamster face hamster yüzü',
  '🐰': 'rabbit face tavşan yüzü',
  '🦊': 'fox face tilki yüzü',
  '🐻': 'bear face ayı yüzü',
  '🐼': 'panda face panda yüzü',
  '🐨': 'koala face koala yüzü',
  '🐯': 'tiger face kaplan yüzü',
  '🦁': 'lion face aslan yüzü',
  '🐮': 'cow face inek yüzü',
  '🐷': 'pig face domuz yüzü',
  '🐸': 'frog face kurbağa yüzü',
  '🐵': 'monkey face maymun yüzü',
  '🙈': 'see no evil görme maymun',
  '🙉': 'hear no evil duyma maymun',
  '🙊': 'speak no evil konuşma maymun',
  '🐔': 'chicken tavuk',
  '🐧': 'penguin penguen',
  '🐦': 'bird kuş',
  '🦆': 'duck ördek',
  '🦅': 'eagle kartal',
  '🦉': 'owl baykuş',
  '🐺': 'wolf kurt',
  '🐴': 'horse face at yüzü',
  '🦄': 'unicorn tekboynuz',
  '🐝': 'bee arı',
  '🦋': 'butterfly kelebek',
  '🐌': 'snail salyangoz',
  '🐞': 'ladybug uğur böceği',
  '🐙': 'octopus ahtapot',
  
  // Plants
  '🌸': 'cherry blossom kiraz çiçeği',
  '🌹': 'rose gül kırmızı',
  '🌺': 'hibiscus amber çiçeği',
  '🌻': 'sunflower ayçiçeği',
  '🌼': 'blossom çiçek',
  '🌷': 'tulip lale',
  '🌱': 'seedling fide filiz',
  '🌲': 'evergreen tree çam ağacı',
  '🌳': 'deciduous tree yaprak döken ağaç',
  '🌴': 'palm tree palmiye',
  '🌵': 'cactus kaktüs',
  '🍀': 'four leaf clover dört yapraklı yonca şans lucky',
  '🍁': 'maple leaf akçaağaç yaprağı',
  '🍂': 'fallen leaf düşmüş yaprak sonbahar',
  '🍃': 'leaf in wind rüzgarda yaprak',
  '🍄': 'mushroom mantar',
  
  // Food
  '🍏': 'green apple yeşil elma',
  '🍎': 'red apple kırmızı elma',
  '🍐': 'pear armut',
  '🍊': 'tangerine mandalina portakal orange',
  '🍋': 'lemon limon',
  '🍌': 'banana muz',
  '🍉': 'watermelon karpuz',
  '🍇': 'grapes üzüm',
  '🍓': 'strawberry çilek',
  '🍒': 'cherries kiraz',
  '🍑': 'peach şeftali',
  '🥭': 'mango',
  '🍍': 'pineapple ananas',
  '🥥': 'coconut hindistan cevizi',
  '🥝': 'kiwi',
  '🍅': 'tomato domates',
  '🍆': 'eggplant aubergine patlıcan mor',
  '🥑': 'avocado avokado',
  '🥦': 'broccoli brokoli',
  '🥒': 'cucumber salatalık',
  '🌶️': 'hot pepper acı biber',
  '🌽': 'corn mısır',
  '🥕': 'carrot havuç',
  '🧄': 'garlic sarımsak',
  '🧅': 'onion soğan',
  '🥔': 'potato patates',
  '🍠': 'sweet potato tatlı patates',
  '🥐': 'croissant kruvasan',
  '🥖': 'baguette bread ekmek baget',
  '🍞': 'bread ekmek',
  '🍳': 'cooking egg yumurta sahanda',
  '🥚': 'egg yumurta',
  '🧀': 'cheese peynir',
  '🥓': 'bacon pastırma',
  '🥩': 'cut of meat et biftek',
  '🍗': 'poultry leg tavuk but',
  '🍖': 'meat on bone kemikli et',
  '🌭': 'hot dog sosisli sandviç',
  '🍔': 'hamburger burger',
  '🍟': 'fries patates kızartması french fries',
  '🍕': 'pizza',
  '🥪': 'sandwich sandviç',
  '🌮': 'taco tako',
  '🌯': 'burrito dürüm',
  '🥗': 'salad green salata',
  '🍝': 'spaghetti makarna pasta',
  '🍜': 'steaming bowl noodle ramen',
  '🍲': 'pot of food güveç',
  '🍛': 'curry rice pilav köri',
  '🍣': 'sushi suşi',
  '🍱': 'bento box bento kutusu',
  '🍤': 'fried shrimp kızarmış karides',
  '🍧': 'shaved ice tıraş buz',
  '🍨': 'ice cream dondurma',
  '🍦': 'soft ice cream dondurma külah',
  '🥧': 'pie turta pay',
  '🧁': 'cupcake',
  '🍰': 'shortcake pasta dilimi cake',
  '🎂': 'birthday cake doğum günü pastası',
  '🍮': 'custard puding karamel',
  '🍭': 'lollipop şeker lolipop',
  '🍬': 'candy şeker',
  '🍫': 'chocolate bar çikolata',
  '🍿': 'popcorn patlamış mısır',
  '🍩': 'doughnut donut',
  '🍪': 'cookie kurabiye bisküvi',
  '🥜': 'peanuts fıstık yer fıstığı',
  '🍯': 'honey pot bal',
  
  // Drinks
  '🥛': 'glass of milk süt bardağı',
  '☕': 'hot beverage coffee kahve çay tea',
  '🍵': 'teacup çay fincanı tea',
  '🧃': 'juice box meyve suyu',
  '🥤': 'cup with straw bardak pipet',
  '🍺': 'beer bira',
  '🍻': 'clinking beers bira kadeh tokuşturma cheers şerefe',
  '🥂': 'clinking glasses kadeh champagne şampanya şerefe cheers',
  '🍷': 'wine glass şarap bardağı',
  '🥃': 'tumbler glass viski bardağı whiskey',
  '🍸': 'cocktail glass kokteyl martini',
  '🍹': 'tropical drink tropik içecek',
  '🍾': 'bottle with cork şampanya şişesi champagne',
  
  // Other common searches
  '💯': 'hundred points yüz puan mükemmel perfect',
  '💢': 'anger symbol öfke sembolü angry',
  '💬': 'speech bubble konuşma balonu',
  '💭': 'thought bubble düşünce balonu',
  '💤': 'zzz sleeping uyuyor uyku',
  '🔔': 'bell zil',
  '✅': 'check mark onay doğru correct yes',
  '❌': 'cross mark çarpı yanlış wrong no hayır',
  '❓': 'question mark soru işareti',
  '❗': 'exclamation mark ünlem işareti',
  '💲': 'dollar sign dolar işareti para money',
  '🚗': 'car automobile araba otomobil',
  '🚀': 'rocket roket uzay',
  '✈️': 'airplane uçak',
  '🏠': 'house ev',
  '📱': 'mobile phone cep telefonu smartphone',
  '💻': 'laptop computer dizüstü bilgisayar',
  '📷': 'camera kamera fotoğraf',
  '🎵': 'musical note müzik notası music',
  '🎶': 'musical notes müzik notaları music',
  '🎮': 'video game oyun gamepad',
  '⏰': 'alarm clock çalar saat',
  '⌚': 'watch kol saati saat',
  '💡': 'light bulb ampul fikir idea',
  '🔋': 'battery pil batarya',
  '📚': 'books kitaplar',
  '✏️': 'pencil kalem',
  '📝': 'memo not kağıt yazı',
  '💰': 'money bag para çanta zengin rich',
  '💎': 'gem stone mücevher elmas diamond değerli',
  '🔑': 'key anahtar',
  '🔒': 'locked kilit kilitli',
  '🔓': 'unlocked açık kilit',
  '⚽': 'soccer ball futbol topu football',
  '🏀': 'basketball basketbol',
  '🎾': 'tennis tenis',
  '⚾': 'baseball beyzbol',
  '🏈': 'american football amerikan futbolu',
  '🎯': 'bullseye hedef target dart',
  '🎰': 'slot machine kumar casino',
  '🎲': 'game die zar dice',
  '♠️': 'spade maça',
  '♥️': 'heart suit kupa',
  '♦️': 'diamond suit karo',
  '♣️': 'club suit sinek',
  '🃏': 'joker',
  '🀄': 'mahjong',
  '🌈': 'rainbow gökkuşağı',
  '☀️': 'sun güneş sunny',
  '🌙': 'moon ay gece',
  '⭐': 'star yıldız',
  '☁️': 'cloud bulut',
  '⛈️': 'cloud lightning thunder fırtına şimşek gök gürültüsü',
  '🌧️': 'cloud rain yağmur raining',
  '❄️': 'snowflake kar tanesi snow',
  '🌊': 'wave dalga deniz sea ocean',
  '🏖️': 'beach umbrella plaj şemsiye',
  '🏔️': 'mountain dağ',
  '🗻': 'mount fuji dağ',
  '🌋': 'volcano volkan',
  '🏕️': 'camping kamp çadır',
  '⛺': 'tent çadır',
  '🎪': 'circus tent sirk',
  '🎡': 'ferris wheel dönme dolap',
  '🎢': 'roller coaster lunapark treni',
  '💍': 'ring yüzük evlilik marriage wedding',
  '👑': 'crown taç kral king queen kraliçe',
  '🎩': 'top hat silindir şapka',
  '👓': 'glasses gözlük',
  '🕶️': 'sunglasses güneş gözlüğü',
  '👔': 'necktie kravat iş business',
  '👗': 'dress elbise',
  '👠': 'high heeled shoe topuklu ayakkabı',
  '👟': 'sneaker spor ayakkabı',
  '🧢': 'billed cap şapka',
  '💄': 'lipstick ruj',
  '💋': 'kiss mark öpücük izi',
  '👄': 'mouth ağız dudak lips',
  '👅': 'tongue dil',
  '👂': 'ear kulak',
  '👃': 'nose burun',
  '👀': 'eyes gözler bakış look',
  '👁️': 'eye göz',
  '🧠': 'brain beyin',
  '🦴': 'bone kemik',
  '🦷': 'tooth diş',
  '👶': 'baby bebek',
  '👧': 'girl kız çocuk',
  '👦': 'boy erkek çocuk',
  '👩': 'woman kadın',
  '👨': 'man adam erkek',
  '👵': 'old woman yaşlı kadın grandmother büyükanne',
  '👴': 'old man yaşlı adam grandfather büyükbaba',
  '👮': 'police officer polis',
  '👷': 'construction worker inşaat işçisi',
  '👸': 'princess prenses',
  '🤴': 'prince prens',
  '🎅': 'santa claus noel baba christmas',
  '🤶': 'mrs claus noel anne',
  '🧙': 'mage wizard büyücü',
  '🧚': 'fairy peri',
  '🧜': 'merperson deniz kızı mermaid',
  '🧝': 'elf',
  '🧛': 'vampire vampir',
  '🧟': 'zombie',
  '💀': 'skull kafatası iskelet skeleton dead ölü'
};

// Comprehensive emoji list organized by approximate category
const ALL_EMOJIS = [
  // Smileys & Emotion
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
  '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋',
  '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
  '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
  '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
  '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
  '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
  '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
  
  // Gestures & Body
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
  '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
  '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
  '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
  '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅',
  '👄', '💋', '🩸',
  
  // Hearts & Love
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
  
  // Celebration & Objects
  '🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🥈', '🥉', '🏅',
  '🎖️', '🎗️', '🎯', '🎮', '🎲', '🎰', '🎭', '🎨', '🎬', '🎤',
  '🎧', '🎵', '🎶', '🎹', '🎸', '🎺', '🎻', '🥁', '📱', '💻',
  '⌨️', '🖥️', '🖨️', '🖱️', '💿', '📀', '📷', '📹', '🎥', '📺',
  '📻', '🎙️', '⏰', '⌚', '📡', '🔋', '🔌', '💡', '🔦', '🕯️',
  
  // Nature & Animals
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
  '🦄', '🐝', '🪲', '🐛', '🦋', '🐌', '🐞', '🐜', '🪳', '🦟',
  '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱',
  '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁',
  '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🐙', '🦪',
  
  // Food & Drink
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
  '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
  '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
  '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧇', '🥞', '🧈',
  '🍳', '🥚', '🧀', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔',
  '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗',
  '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪',
  '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧',
  '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
  '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖',
  '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃',
  '🍸', '🍹', '🧉', '🍾', '🧊',
  
  // Travel & Places
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼',
  '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️',
  '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚂', '🚃', '🚄', '🚅',
  '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
  '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌',
  '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄',
  '🌅', '🌆', '🌇', '🌉', '🌌', '🎠', '🎡', '🎢', '💈', '🎪',
  
  // Symbols
  '⭐', '🌟', '✨', '💫', '🔥', '💥', '💢', '💦', '💨', '🕳️',
  '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🔔', '🔕', '🎵',
  '🎶', '💹', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌',
  '❎', '➕', '➖', '➗', '✖️', '💲', '💱', '©️', '®️', '™️',
  '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',
  '8️⃣', '9️⃣', '🔟', '🔢', '🔣', '🔤', '🔡', '🔠', '🔼', '🔽',
  '⬆️', '⬇️', '⬅️', '➡️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️',
  '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️',
  '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅',
  '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✳️', '✴️', '❇️',
  '©️', '®️', '™️', '♾️', '🔚', '🔙', '🔛', '🔜', '🔝'
];

// State
let selectedEmojis = [...DEFAULT_EMOJIS];
let draggedElement = null;
let draggedIndex = null;

// DOM Elements
const selectedEmojisContainer = document.getElementById('selectedEmojis');
const emojiGrid = document.getElementById('emojiGrid');
const searchInput = document.getElementById('emojiSearch');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const toast = document.getElementById('toast');

/**
 * Get localized message with fallback
 */
function getMessage(key, fallback) {
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
    const msg = chrome.i18n.getMessage(key);
    return msg || fallback;
  }
  return fallback;
}

/**
 * Localize all elements with data-i18n attributes
 */
function localizeUI() {
  // Localize text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const msg = getMessage(key, el.textContent);
    el.textContent = msg;
  });
  
  // Localize placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const msg = getMessage(key, el.placeholder);
    el.placeholder = msg;
  });
}

/**
 * Initialize the popup
 */
function init() {
  localizeUI();
  loadFromStorage();
  renderSelectedEmojis();
  renderEmojiGrid();
  setupEventListeners();
}

/**
 * Load saved emojis from Chrome storage
 */
function loadFromStorage() {
  chrome.storage.sync.get(['customEmojis'], (result) => {
    if (result.customEmojis && Array.isArray(result.customEmojis)) {
      selectedEmojis = result.customEmojis;
    }
    renderSelectedEmojis();
    renderEmojiGrid();
  });
}

/**
 * Save emojis to Chrome storage
 */
function saveToStorage() {
  chrome.storage.sync.set({ customEmojis: selectedEmojis }, () => {
    showToast(getMessage('savedToast', 'Saved!') + ' ✓');
  });
}

/**
 * Render the selected emojis list
 */
function renderSelectedEmojis() {
  selectedEmojisContainer.innerHTML = '';
  
  selectedEmojis.forEach((emoji, index) => {
    const item = document.createElement('div');
    item.className = 'emoji-item';
    item.draggable = true;
    item.dataset.index = index;
    
    item.innerHTML = `
      <span class="emoji">${emoji}</span>
      <button class="remove-btn" data-index="${index}" title="${getMessage('remove', 'Remove')}">×</button>
    `;
    
    // Drag events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    
    selectedEmojisContainer.appendChild(item);
  });
  
  // Update counter in header if exists
  updateCounter();
}

/**
 * Render available emojis grid
 */
function renderEmojiGrid(filter = '') {
  emojiGrid.innerHTML = '';
  
  const normalizedFilter = filter.toLowerCase().trim();
  
  const filteredEmojis = normalizedFilter 
    ? ALL_EMOJIS.filter(emoji => {
        // Match emoji character itself
        if (emoji.includes(normalizedFilter)) return true;
        
        // Match emoji name (English/Turkish)
        const names = EMOJI_NAMES[emoji];
        if (names && names.toLowerCase().includes(normalizedFilter)) return true;
        
        return false;
      })
    : ALL_EMOJIS;
  
  filteredEmojis.forEach(emoji => {
    const button = document.createElement('button');
    button.className = 'emoji-option';
    button.textContent = emoji;
    button.title = getMessage('clickToAdd', 'Click to add');
    
    if (selectedEmojis.includes(emoji)) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', () => toggleEmoji(emoji));
    emojiGrid.appendChild(button);
  });
}

/**
 * Toggle emoji selection
 */
function toggleEmoji(emoji) {
  const index = selectedEmojis.indexOf(emoji);
  
  if (index > -1) {
    // Remove emoji
    selectedEmojis.splice(index, 1);
  } else {
    // Add emoji
    selectedEmojis.push(emoji);
  }
  
  renderSelectedEmojis();
  renderEmojiGrid(searchInput.value);
}

/**
 * Remove emoji by index
 */
function removeEmoji(index) {
  selectedEmojis.splice(index, 1);
  renderSelectedEmojis();
  renderEmojiGrid(searchInput.value);
}

/**
 * Update the emoji counter
 */
function updateCounter() {
  const headerTitle = document.querySelector('header h1');
  const existingCounter = headerTitle.querySelector('.counter');
  
  if (existingCounter) {
    existingCounter.textContent = selectedEmojis.length;
  } else {
    const counter = document.createElement('span');
    counter.className = 'counter';
    counter.textContent = selectedEmojis.length;
    headerTitle.appendChild(counter);
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

// Drag and Drop Handlers
function handleDragStart(e) {
  draggedElement = e.currentTarget;
  draggedIndex = parseInt(e.currentTarget.dataset.index);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedElement = null;
  draggedIndex = null;
  
  // Remove any remaining placeholders
  const placeholders = selectedEmojisContainer.querySelectorAll('.placeholder');
  placeholders.forEach(p => p.remove());
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.currentTarget;
  if (target !== draggedElement && target.classList.contains('emoji-item')) {
    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    
    if (e.clientX < midpoint) {
      target.style.borderLeft = '2px solid #25d366';
      target.style.borderRight = '';
    } else {
      target.style.borderRight = '2px solid #25d366';
      target.style.borderLeft = '';
    }
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  const target = e.currentTarget;
  target.style.borderLeft = '';
  target.style.borderRight = '';
  
  if (target !== draggedElement && target.classList.contains('emoji-item')) {
    const targetIndex = parseInt(target.dataset.index);
    
    // Remove from old position
    const emoji = selectedEmojis.splice(draggedIndex, 1)[0];
    
    // Calculate new position
    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    let newIndex = e.clientX < midpoint ? targetIndex : targetIndex + 1;
    
    // Adjust if dragging from before to after
    if (draggedIndex < targetIndex) {
      newIndex--;
    }
    
    // Insert at new position
    selectedEmojis.splice(newIndex, 0, emoji);
    
    renderSelectedEmojis();
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search input
  searchInput.addEventListener('input', (e) => {
    renderEmojiGrid(e.target.value);
  });
  
  // Save button
  saveBtn.addEventListener('click', saveToStorage);
  
  // Reset button
  resetBtn.addEventListener('click', () => {
    if (confirm(getMessage('confirmReset', 'Are you sure you want to reset to default emojis?'))) {
      selectedEmojis = [...DEFAULT_EMOJIS];
      saveToStorage();
      renderSelectedEmojis();
      renderEmojiGrid(searchInput.value);
    }
  });
  
  // Remove buttons (event delegation)
  selectedEmojisContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index);
      removeEmoji(index);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveToStorage();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
