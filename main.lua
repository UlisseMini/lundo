foo = 0; bar =1

local qux = 300

xyz = function(a,s,d)local k=s+a
  return s*d*k end

function asdf(a,d) return a*d end

for i=1,5,2 do print(i)print'boo' end
for i=1,100 do print(i) end

for v in ipairs{5,4,3} do print(v) end

for k,v in pairs{a=4,d=6,[print]=7} do print(k,v) end

print'foo'

print(xyz(asdf(3,2.5, 'qux')))

print(string.char(69))
print(string['char'](69))

while not k < 3 and k > 4 do
  print(k)
  k = k + 1
  k = k / 2
end

string.char = 5
string['char'] = 6
tonumber('0x8'):read()

if 5 > 7 then print('kek') elseif 5 < 3 then print('no') else print('ok') end

local x,y

