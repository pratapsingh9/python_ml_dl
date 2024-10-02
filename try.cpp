#include <bits/stdc++.h>

using namespace std;


int main() {
    vector<int> v = {1,2,3,4,5};
    v.reserve(10);
    v.resize(6,5);

    cout << v.size() << endl << v.capacity();

    
}