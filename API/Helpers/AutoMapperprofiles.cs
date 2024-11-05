using System;
using API.Data;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperprofiles :Profile
{
    public AutoMapperprofiles()
    {
        CreateMap<AppUser,MemberDto>()
            .ForMember(d => d.Age, o => o.MapFrom(s => s.DateOfBirth.CaluclateAge()))
            .ForMember(d => d.PhotoUrl,o =>
                o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        CreateMap<Photo,PhotoDto>();

    }
}
